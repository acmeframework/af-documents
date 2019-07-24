# af-documents

## Status of Project

[![Build Status](https://api.travis-ci.org/acmeframework/af-documents.svg?branch=master)](https://travis-ci.org/acmeframework/af-documents) [![Coverage Status](https://coveralls.io/repos/github/acmeframework/af-documents/badge.svg)](https://coveralls.io/github/acmeframework/af-documents)

## Installation

```bash
npm install af-documents
```

## Description

The Documents Library provides classes that make working with Documents and Properties easier. A `Document` is an entity that contains Properties, nested Documents, and/or arrays of Properties. A `Property` is an entity that represents a value - string, number, boolean, and immutable are basic properties - and RegExp and Email are properties that build upon the basic properties.

Properties can have `Validator`s and `Normalizer`s assigned to them. This makes each `Property` a self contained entity that knows how to manage the value it represents.

A `Property` implements the `toString` and `valueOf` methods so they can be used in traditional ways as well.

```javascript
const firstName = StringProperty('Steve', { name: 'firstName' });
const lastName = StringProperty('Smith', { name: 'lastName' });

const fullName = firstName + ' ' + lastName;
```

It does seem a little overkill to put strings in a `Property` or really any value when plain object will suffice. However, combining a `Property` with the `propertyBuilder` method can make ingesting, validating, and normalizing data a breeze.

`propertyBuilder` uses a `PropertyDescriptionMap` that can allow you to quickly create objects with Properties as its members that represent data from external sources with the knowledge that invalid data will be caught and data can be normalized as you want it quickly.

## [Support Issues](https://github.com/acmeframework/af-documents/issues)

## Release Notes

### v1.0.0

This is the initial release version. The code has been thoroughly tested with 100% coverage.

## The MIT License

Copyright &copy; 2019 Acme Framework

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
