//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function printNumber(x: number): void;
declare function consoleLog(x: string): void;
declare function createMyWalkingEvent(value1: string, value2: string, value3: string): void;
export function filterCode(): void {
var Longitude = getIngredient("Longitude");
var Latitude = getIngredient("Latitude");

consoleLog(Longitude);
consoleLog(Latitude);

// https://www.movable-type.co.uk/scripts/latlong.html
var lat1: f64 = parseFloat(Latitude.substring(2, Latitude.length - 2));
var lon1: f64 = parseFloat(Longitude.substring(2, Longitude.length - 2));

// home
var lat2: f64 = 59.34882930194417;
var lon2: f64 = 18.063593753239786;

const R = 6371e3; // metres
const φ1 = lat1 * Math.PI/180.0; // φ, λ in radians
const φ2 = lat2 * Math.PI/180.0;
const Δφ = (lat2-lat1) * Math.PI/180.0;
const Δλ = (lon2-lon1) * Math.PI/180.0;

const a = Math.sin(Δφ/2.0) * Math.sin(Δφ/2.0) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2.0) * Math.sin(Δλ/2.0);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0-a));

const d = R * c; // in metres

// https://en.wikipedia.org/wiki/Preferred_walking_speed
const mPerMin: f64 = 1.42 * 60.0; // speed

const duration_minutes: i32 = <i32>Math.ceil(d / mPerMin);

const distance_km = (Math.trunc(d / 100.0) / 10.0); // one decimal precision

printNumber(d);
printNumber(duration_minutes);
printNumber(distance_km);

createMyWalkingEvent(duration_minutes.toString(), distance_km.toString(), "");
}