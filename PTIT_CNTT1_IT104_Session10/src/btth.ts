class Passenger {
  passengerId: number;
  name: string;
  passportNumber: string;

  constructor(id: number, name: string, passportNumber: string) {
    this.passengerId = id;
    this.name = name;
    this.passportNumber = passportNumber;
  }

  getDetails(): string {
    return `Passenger #${this.passengerId} - ${this.name}, Passport: ${this.passportNumber}`;
  }
}

class Flight {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  capacity: number;
  bookedSeats: number;

  constructor(flightNumber: string, origin: string, destination: string, departureTime: string, capacity: number) {
    this.flightNumber = flightNumber;
    this.origin = origin;
    this.destination = destination;
    this.departureTime = departureTime;
    this.capacity = capacity;
    this.bookedSeats = 0;
  }

  bookSeat(): boolean {
    if (this.isFull()) return false;
    this.bookedSeats++;
    return true;
  }

  isFull(): boolean {
    return this.bookedSeats >= this.capacity;
  }

  calculateBaggageFee(weight: number): number {
    return 0;
  }
}

class DomesticFlight extends Flight {
  calculateBaggageFee(weight: number): number {
    return weight * 50000;
  }
}

class InternationalFlight extends Flight {
  calculateBaggageFee(weight: number): number {
    return weight * 10;
  }
}

class Booking {
  bookingId: number;
  passenger: Passenger;
  flight: Flight;
  numberOfTickets: number;
  totalCost: number;

  constructor(id: number, passenger: Passenger, flight: Flight, numberOfTickets: number) {
    this.bookingId = id;
    this.passenger = passenger;
    this.flight = flight;
    this.numberOfTickets = numberOfTickets;
    this.totalCost = numberOfTickets * 200;
  }

  getBookingDetails(): string {
    return `Booking #${this.bookingId} - ${this.passenger.name} on flight ${this.flight.flightNumber}, Tickets: ${this.numberOfTickets}, Total: ${this.totalCost}`;
  }
}

class AirlineManager {
  passengers: Passenger[] = [];
  flights: Flight[] = [];
  bookings: Booking[] = [];
  passengerIdCounter: number = 1;
  bookingIdCounter: number = 1;

  addPassenger(name: string, passport: string): void {
    const p = new Passenger(this.passengerIdCounter++, name, passport);
    this.passengers.push(p);
  }

  addFlight(flight: Flight): void {
    this.flights.push(flight);
  }

  createBooking(passengerId: number, flightNumber: string, numberOfTickets: number): Booking | null {
    const passenger = this.passengers.find(p => p.passengerId === passengerId);
    const flight = this.flights.find(f => f.flightNumber === flightNumber);
    if (!passenger || !flight || flight.isFull()) return null;
    for (let i = 0; i < numberOfTickets; i++) {
      if (!flight.bookSeat()) return null;
    }
    const booking = new Booking(this.bookingIdCounter++, passenger, flight, numberOfTickets);
    this.bookings.push(booking);
    return booking;
  }

  cancelBooking(bookingId: number): void {
    this.bookings = this.bookings.filter(b => b.bookingId !== bookingId);
  }

  listAvailableFlights(origin: string, dest: string): void {
    const flights = this.flights.filter(f => f.origin === origin && f.destination === dest && !f.isFull());
    console.log("Available flights:", flights.map(f => f.flightNumber));
  }

  listBookingsByPassenger(passengerId: number): void {
    const bookings = this.bookings.filter(b => b.passenger.passengerId === passengerId);
    bookings.forEach(b => console.log(b.getBookingDetails()));
  }

  calculateTotalRevenue(): number {
    return this.bookings.reduce((sum, b) => sum + b.totalCost, 0);
  }

  countFlightsByType(): void {
    let domestic = 0, international = 0;
    for (const f of this.flights) {
      if (f instanceof DomesticFlight) domestic++;
      else if (f instanceof InternationalFlight) international++;
    }
    console.log("Domestic:", domestic, "International:", international);
  }

  updateFlightTime(flightNumber: string, newTime: string): void {
    const flight = this.flights.find(f => f.flightNumber === flightNumber);
    if (flight) flight.departureTime = newTime;
  }

  getFlightPassengerList(flightNumber: string): void {
    const list = this.bookings.filter(b => b.flight.flightNumber === flightNumber).map(b => b.passenger.name);
    console.log(`Passengers on ${flightNumber}:`, list);
  }
}
