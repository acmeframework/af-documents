import 'mocha';

import { isUsable } from 'af-conditionals';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import util = require('util');

import {
  Document,
  DocumentEntity,
  DocumentOptions,
  Property,
  propertyBuilder,
  stringPropertyFactory,
} from '../../../src/lib';
import {
  AGE_NAME,
  AGE_VALUE1,
  AGE_VALUE2,
  BAD_FIRST_NAME_VALUE,
  BAD_JSON_OBJECT,
  BAD_PROPERTY_NAME,
  FIRST_NAME_NAME,
  FIRST_NAME_VALUE1,
  FIRST_NAME_VALUE2,
  LAST_NAME_NAME,
  LAST_NAME_VALUE1,
  LAST_NAME_VALUE2,
  ME_NAME,
  ME_VALUE1,
  MULTIPLE_ARRAYS_TEST_OBJECT,
  MULTIPLE_DOCUMENTS_TEST_OBJECT,
  SIMPLE_JSON_OBJECT,
  SIMPLE_OBJECT,
  SIMPLE_OBJECT_UNKNOWNFIELD,
  TEST_OBJECT1,
  TEST_OBJECT2,
} from './document-test-data';

const setTimeoutPromise = util.promisify(setTimeout);

chai.use(chaiAsPromised);
const expect = chai.expect;

// tslint:disable:no-unused-expression

interface DocumentTesterOptions extends DocumentOptions {
  delayResponse?: boolean;
}

class DocumentTester extends Document<
  DocumentEntity,
  Record<string, any>,
  DocumentTesterOptions
> {
  protected async _validate(): Promise<boolean> {
    if (this.options.delayResponse) {
      await setTimeoutPromise(200);
    }
    return await super._validate();
  }

  protected _validateOptions(newOptions: DocumentTesterOptions): void {
    super._validateOptions(newOptions);

    if (!isUsable(this.options.delayResponse)) {
      this.options.delayResponse = false;
    }
  }
}

describe('Document class', function() {
  describe('Tests the construction and options', function() {
    it('throws a SyntaxError or TypeError exception', function() {
      expect(function() {
        // @ts-ignore
        new Document(undefined);
      }).to.throw(TypeError);

      expect(function() {
        new Document([]);
      }).to.throw(TypeError);

      expect(function() {
        new Document(BAD_JSON_OBJECT);
      }).to.throw(SyntaxError);
    });

    it('creates a Document using an object', function() {
      expect(new Document(SIMPLE_OBJECT)).to.be.an.instanceof(Document);
    });

    it('creates a Document using a JSON string', function() {
      expect(new Document(SIMPLE_JSON_OBJECT)).to.be.an.instanceof(Document);
    });

    it('creates a Document using an object with unknown field(s)', function() {
      const doc = new Document(SIMPLE_OBJECT_UNKNOWNFIELD);
      const me = stringPropertyFactory('Michael Coakley', 'me');

      expect(doc).to.be.an.instanceof(Document);
      expect(doc.getEntities()['me']).to.deep.equal(me);
    });
  });

  describe('Tests the functionality of the class - simple objects', function() {
    let doc: DocumentTester;
    let testCount = 0;

    const TEST_OPTIONS: DocumentTesterOptions[] = [
      {}, // 1
      {}, // 2
      { delayResponse: true }, // 3
      { validationStopOnInvalid: true }, // 4
      {}, // 5
      {}, // 6
      {} // 7
    ];

    beforeEach(function() {
      const doco = TEST_OPTIONS[testCount++];
      doc = new DocumentTester(TEST_OBJECT1, doco);
    });

    it(' 1. tests getting individual properties and a list of properties', function() {
      const firstName = propertyBuilder(FIRST_NAME_VALUE1, FIRST_NAME_NAME)!;
      const lastName = propertyBuilder(LAST_NAME_VALUE1, LAST_NAME_NAME)!;

      const fieldList: Record<string, any> = {
        firstName,
        lastName
      };

      expect(doc.getEntity(FIRST_NAME_NAME)).to.deep.equal(firstName);
      expect(doc.getEntity(LAST_NAME_NAME)).to.deep.equal(lastName);

      // BAD_PROPERTY_NAME is on the list for coverage
      expect(
        doc.getEntities([FIRST_NAME_NAME, LAST_NAME_NAME, BAD_PROPERTY_NAME])
      ).to.deep.equal(fieldList);
    });

    it(' 2. tests getting a properties value', function() {
      expect(doc.getEntityValue(AGE_NAME)).to.equal(AGE_VALUE1);
      expect(doc.getEntityValue(FIRST_NAME_NAME)).to.equal(FIRST_NAME_VALUE1);
      expect(doc.getEntityValue(LAST_NAME_NAME)).to.equal(LAST_NAME_VALUE1);
      expect(doc.getEntityValue(ME_NAME)).to.equal(ME_VALUE1);

      // Coverage...
      expect(doc.getEntityValue(BAD_PROPERTY_NAME)).to.be.undefined;
    });

    it(' 3. tests validating a Document (at least 400ms delay)', async function() {
      async function firstTest() {
        expect(await doc.validate()).to.be.true;
      }

      async function secondTest() {
        // We only put this test in the loop SO we can get coverages
        // of the isValidating method
        try {
          let i = 0;
          while (doc.isValidating()) {
            i++;
            if (i === 1) {
              expect(await doc.validate()).to.be.false; // This is definitely wrong
            }
          }
          // We will never get here...
          expect(true).to.be.false;
        } catch (err) {
          // This is an error indicating that validate was already
          // running.
          expect(err.message).to.equal(
            'A call to validate was made while validation is ' +
              'already running for this document.'
          );
        }
      }

      await Promise.all([firstTest(), secondTest()]);

      const firstName: Property = doc.getEntity(FIRST_NAME_NAME) as Property;
      // Let's make firstName invalid
      firstName.value = BAD_FIRST_NAME_VALUE;
      expect(await doc.validate()).to.to.false;
    });

    it(
      ' 4. validates the Document object with stopValidationOnInvalid ' +
        'true',
      async function() {
        const firstName: Property = doc.getEntity(FIRST_NAME_NAME) as Property;
        // Let's make firstName invalid
        firstName.value = BAD_FIRST_NAME_VALUE;
        expect(await doc.validate()).to.to.false;
      }
    );

    it(' 5. executes the normalize workflow', function() {
      doc.normalize();
    });

    it(' 6. tests the setPropertyValue method', function() {
      const NEW_FIRST_NAME_VALUE = 'The Wonderful';

      const origValue = doc.getEntityValue(FIRST_NAME_NAME);
      doc.setEntityValue(FIRST_NAME_NAME, NEW_FIRST_NAME_VALUE);
      const newValue = doc.getEntityValue(FIRST_NAME_NAME);
      expect(newValue).to.not.equal(origValue);

      expect(function() {
        doc.setEntityValue(BAD_PROPERTY_NAME, BAD_FIRST_NAME_VALUE);
      }).to.throw(TypeError);
    });

    it(' 7. uses toString() on the Document object', function() {
      const toString = doc.toString();
      expect(toString).to.be.a('string');
    });
  });

  describe('Tests the functionality of the class - complex objects', function() {
    let doc: DocumentTester;
    let testCount = 0;

    const TEST_OPTIONS: DocumentTesterOptions[] = [
      {}, // 1
      {}, // 2
      {}, // 3
      {} // 4
    ];

    const TEST_DATA: any[] = [
      MULTIPLE_DOCUMENTS_TEST_OBJECT,
      MULTIPLE_ARRAYS_TEST_OBJECT,
      MULTIPLE_DOCUMENTS_TEST_OBJECT,
      MULTIPLE_ARRAYS_TEST_OBJECT
    ];

    beforeEach(function() {
      const thisTest = testCount++;
      const doco = TEST_OPTIONS[thisTest];
      doc = new DocumentTester(TEST_DATA[thisTest], doco);
    });

    it(' 1. tests getting individual documents', function() {
      const doc1 = new DocumentTester(TEST_OBJECT1);
      const doc2 = new DocumentTester(TEST_OBJECT2);

      expect(doc.getEntity('person1')).to.deep.equal(doc1);
      expect(doc.getEntity('person2')).to.deep.equal(doc2);

      // For coverage
      expect(doc.getEntityValue('person1')).to.deep.equal(doc1);

      doc.setEntityValue('person2', doc1);
      expect(doc.getEntityValue('person2')).to.deep.equal(doc1);
    });

    it(' 2. tests getting multiple array types', function() {
      // We must mirror the process of building a property value with an
      // unrecognized property NAME from the default alias map.
      //
      const ages1 = stringPropertyFactory(AGE_VALUE1 as any, 'ages');
      const ages2 = stringPropertyFactory(AGE_VALUE2 as any, 'ages');

      const firstName1 = propertyBuilder(FIRST_NAME_VALUE1, FIRST_NAME_NAME);
      const firstName2 = propertyBuilder(FIRST_NAME_VALUE2, FIRST_NAME_NAME);
      const lastName1 = propertyBuilder(LAST_NAME_VALUE1, LAST_NAME_NAME);
      const lastName2 = propertyBuilder(LAST_NAME_VALUE2, LAST_NAME_NAME);
      const array1 = [ages1, ages2];
      const array2 = [firstName1, firstName2];
      const array3 = [lastName1, lastName2];
      const person1 = {
        age: AGE_VALUE1,
        firstName: FIRST_NAME_VALUE1,
        lastName: LAST_NAME_VALUE1
      };
      const person2 = {
        age: AGE_VALUE2,
        firstName: FIRST_NAME_VALUE2,
        lastName: LAST_NAME_VALUE2
      };
      const personDoc1 = new DocumentTester(person1);
      const personDoc2 = new DocumentTester(person2);
      const people = [personDoc1, personDoc2];

      expect(doc.getEntity('ages')).to.deep.equal(array1);
      expect(doc.getEntity('first_names')).to.deep.equal(array2);
      expect(doc.getEntity('last_names')).to.deep.equal(array3);
      expect(doc.getEntity('people')).to.deep.equal(people);
    });

    it(' 3. executes the normalize workflow on documents within a document', function() {
      doc.normalize();
    });

    it(' 4. executes the normalize workflow on arrays within a document', function() {
      doc.normalize();
    });
  });
});
