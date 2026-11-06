import assert from 'node:assert/strict';
import test from 'node:test';
import { DEMO_JOBS_RADIUS_METERS, generateDemoCoordinates } from './demoCoordinates.ts';

const distanceBetween = (first, second) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDifference = toRadians(second.latitude - first.latitude);
  const longitudeDifference = toRadians(second.longitude - first.longitude);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(first.latitude)) *
      Math.cos(toRadians(second.latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 2 * 6_371_000 * Math.asin(Math.sqrt(haversine));
};

test('demo coordinates stay within the radius and valid geographic bounds', () => {
  const center = { latitude: 64.1466, longitude: -21.9426 };

  for (let index = 0; index < 100; index += 1) {
    const point = generateDemoCoordinates(center);

    assert.ok(point.latitude >= -90 && point.latitude <= 90);
    assert.ok(point.longitude >= -180 && point.longitude <= 180);
    assert.ok(distanceBetween(center, point) <= DEMO_JOBS_RADIUS_METERS + 0.001);
  }
});

test('demo coordinates account for the center latitude when offsetting longitude', () => {
  const originalRandom = Math.random;
  const randomValues = [0.25, 0.25, 0.25, 0.25];
  Math.random = () => randomValues.shift() ?? 0;

  try {
    const equatorialPoint = generateDemoCoordinates({ latitude: 0, longitude: 0 });
    const highLatitudePoint = generateDemoCoordinates({ latitude: 60, longitude: 0 });

    assert.ok(Math.abs(highLatitudePoint.longitude) > Math.abs(equatorialPoint.longitude));
  } finally {
    Math.random = originalRandom;
  }
});
