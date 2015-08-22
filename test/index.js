'use strict';

var expect = require('chai').expect;
var geojsonhint = require('geojsonhint');
var inside = require('turf-inside');
var random = require('turf-random');
var randomPointsOnPolygon = require('../');

var number = 10;
var numberFloat = 20.6;
var polygonFeature = random('polygon').features[0];
var properties = {
  test: 1
};

describe('random-points-on-polygon', function() {
  it('should create feature collection of random points within a polygon', function() {
    var points = randomPointsOnPolygon(number, polygonFeature, properties, true);

    expect(points).to.be.an('object');
    expect(geojsonhint.hint(points)).to.be.empty;
    expect(points.features).to.be.length(number);
    return points.features.forEach(function(feature) {
      expect(inside(feature, polygonFeature)).to.be.true;
      return expect(feature.properties).to.have.property('test', 1);
    });
  });

  it('should create a feature collection random points within a polygon without properties', function() {
    var points = randomPointsOnPolygon(number, polygonFeature, true);

    expect(points).to.be.an('object');
    expect(geojsonhint.hint(points)).to.be.empty;
    expect(points.features).to.be.length(number);
    return points.features.forEach(function(feature) {
      expect(inside(feature, polygonFeature)).to.be.true;
      return expect(feature.properties).to.be.empty;
    });
  });

  it('should create array of features of random points within a polygon', function() {
    var points = randomPointsOnPolygon(number, polygonFeature, properties);

    expect(points).to.be.an('array');
    expect(points).to.be.length(number);
    return points.forEach(function(feature) {
      expect(geojsonhint.hint(feature)).to.be.empty;
      expect(inside(feature, polygonFeature)).to.be.true;
      return expect(feature.properties).to.have.property('test', 1);
    });
  });

  it('should create an array of features of random points within a polygon without properties', function() {
    var points = randomPointsOnPolygon(number, polygonFeature);

    expect(points).to.be.an('array');
    expect(points).to.be.length(number);
    return points.forEach(function(feature) {
      expect(geojsonhint.hint(feature)).to.be.empty;
      expect(inside(feature, polygonFeature)).to.be.true;
      return expect(feature.properties).to.be.empty;
    });
  });

  it('should create an array of features of random points by rounding a float', function() {
    var points = randomPointsOnPolygon(numberFloat, polygonFeature);

    expect(points).to.be.an('array');
    expect(points).to.be.length(Math.round(numberFloat));
    return points.forEach(function(feature) {
      expect(geojsonhint.hint(feature)).to.be.empty;
      expect(inside(feature, polygonFeature)).to.be.true;
      return expect(feature.properties).to.be.empty;
    });
  });

  it('should return an error when passed an invalid geojson feature', function() {
    var invalidFeature = random('polygon');
    var points = randomPointsOnPolygon(number, invalidFeature);

    return expect(points).to.be.instanceof(Error);
  });

  it('should return an error when passed an invalid feature type', function() {
    var invalidType = random('point');
    var points = randomPointsOnPolygon(number, invalidType);

    return expect(points).to.be.instanceof(Error);
  });

  it('should return an error when passed a number less than 1', function() {
    var invalidNumber = 0;
    var points = randomPointsOnPolygon(invalidNumber, polygonFeature);

    return expect(points).to.be.instanceof(Error);
  });
});
