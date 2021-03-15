# af-documents

## Status of Project

[![Build Status](https://github.com/acmeframework/af-documents/actions/workflows/build-test.yml/badge.svg)](https://github.com/acmeframework/af-documents/actions/workflows/build-test.yml) [![Coverage Status](https://coveralls.io/repos/github/acmeframework/af-documents/badge.svg?branch=main)](https://coveralls.io/github/acmeframework/af-documents?branch=main)

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

## Support

To share your comments, provide suggestions, or raise issues, create an [issue](https://github.com/acmeframework/af-documents/issues).
