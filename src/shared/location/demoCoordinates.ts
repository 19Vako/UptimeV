export const DEMO_JOBS_RADIUS_METERS = 5_000;

const EARTH_RADIUS_METERS = 6_371_000;

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export const generateDemoCoordinates = (
  center: Coordinates,
  radiusMeters = DEMO_JOBS_RADIUS_METERS,
): Coordinates => {
  if (
    !Number.isFinite(center.latitude) ||
    center.latitude < -90 ||
    center.latitude > 90 ||
    !Number.isFinite(center.longitude) ||
    center.longitude < -180 ||
    center.longitude > 180
  ) {
    throw new Error('Unable to get valid device coordinates');
  }

  const distance = radiusMeters * Math.sqrt(Math.random());
  const bearing = 2 * Math.PI * Math.random();
  const angularDistance = distance / EARTH_RADIUS_METERS;
  const latitude = (center.latitude * Math.PI) / 180;
  const longitude = (center.longitude * Math.PI) / 180;

  const destinationLatitude = Math.asin(
    Math.sin(latitude) * Math.cos(angularDistance) +
      Math.cos(latitude) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const destinationLongitude =
    longitude +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitude),
      Math.cos(angularDistance) - Math.sin(latitude) * Math.sin(destinationLatitude),
    );

  return {
    latitude: (destinationLatitude * 180) / Math.PI,
    longitude: (((destinationLongitude * 180) / Math.PI + 540) % 360) - 180,
  };
};
