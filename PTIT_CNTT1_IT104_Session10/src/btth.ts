class Passenger {
  constructor(
    public passengerId: number,
    public name: string,
    public passportNumber: string
  ) {}
  getDetails() {
    return `Passenger #${this.passengerId} - ${this.name}, Passport: ${this.passportNumber}`;
  }
}

class Flight {
  bookedSeats: number = 0;
  constructor(
    public flightNumber: string,
    public origin: string,
    public destination: string,
    public departureTime: string,
    public capacity: number
  ) {}
  bookSeat() {
    if (this.isFull()) return false;
    this.bookedSeats++;
    return true;
  }
  isFull() {
    return this.bookedSeats >= this.capacity;
  }
  calculateBaggageFee(weight: number): number {
    return 0;
  }
}

class DomesticFlight extends Flight {
  calculateBaggageFee(weight: number) {
    return weight * 50000;
  }
}

class InternationalFlight extends Flight {
  calculateBaggageFee(weight: number) {
    return weight * 10;
  }
}

class Booking {
  totalCost: number;
  constructor(
    public bookingId: number,
    public passenger: Passenger,
    public flight: Flight,
    public numberOfTickets: number
  ) {
    this.totalCost = numberOfTickets * 200;
  }
  getBookingDetails() {
    return `Booking #${this.bookingId} - ${this.passenger.name} on flight ${this.flight.flightNumber}, Tickets: ${this.numberOfTickets}, Total: ${this.totalCost}`;
  }
}

class AirlineManager {
  passengers: Passenger[] = [];
  flights: Flight[] = [];
  bookings: Booking[] = [];
  passengerIdCounter = 1;
  bookingIdCounter = 1;

  addPassenger(name: string, passport: string) {
    const p = new Passenger(this.passengerIdCounter++, name, passport);
    this.passengers.push(p);
  }
  addFlight(flight: Flight) {
    this.flights.push(flight);
  }
  createBooking(passengerId: number, flightNumber: string, numberOfTickets: number) {
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
  cancelBooking(bookingId: number) {
    this.bookings = this.bookings.filter(b => b.bookingId !== bookingId);
  }
  listAvailableFlights(origin: string, dest: string) {
    const flights = this.flights.filter(f => f.origin === origin && f.destination === dest && !f.isFull());
    console.log("Available flights:", flights.map(f => f.flightNumber));
  }
  listBookingsByPassenger(passengerId: number) {
    const bookings = this.bookings.filter(b => b.passenger.passengerId === passengerId);
    bookings.forEach(b => console.log(b.getBookingDetails()));
  }
  calculateTotalRevenue() {
    return this.bookings.reduce((sum, b) => sum + b.totalCost, 0);
  }
  countFlightsByType() {
    let domestic = 0, international = 0;
    for (const f of this.flights) {
      if (f instanceof DomesticFlight) domestic++;
      else if (f instanceof InternationalFlight) international++;
    }
    console.log("Domestic:", domestic, "International:", international);
  }
  updateFlightTime(flightNumber: string, newTime: string) {
    const flight = this.flights.find(f => f.flightNumber === flightNumber);
    if (flight) flight.departureTime = newTime;
  }
  getFlightPassengerList(flightNumber: string) {
    const list = this.bookings.filter(b => b.flight.flightNumber === flightNumber).map(b => b.passenger.name);
    console.log(`Passengers on ${flightNumber}:`, list);
  }
}

// ========== Menu ==========
const manager = new AirlineManager();

while (true) {
  console.log(`
===== MENU =====
1. Thêm hành khách mới
2. Thêm chuyến bay mới
3. Tạo giao dịch đặt vé
4. Hủy giao dịch đặt vé
5. Hiển thị chuyến bay còn trống
6. Hiển thị vé đã đặt của một hành khách
7. Tính tổng doanh thu
8. Đếm số lượng chuyến bay nội địa/quốc tế
9. Cập nhật giờ bay
10. Xem danh sách hành khách của một chuyến bay
11. Thoát
`);
  const choice = Number(prompt("Chọn chức năng: "));

  switch (choice) {
    case 1:
      const name = prompt("Tên hành khách: ");
      const passport = prompt("Số hộ chiếu: ");
      manager.addPassenger(name, passport);
      break;
    case 2:
      const type = prompt("Loại (domestic/international): ");
      const flightNumber = prompt("Số hiệu chuyến bay: ");
      const origin = prompt("Điểm đi: ");
      const dest = prompt("Điểm đến: ");
      const time = prompt("Giờ khởi hành: ");
      const cap = Number(prompt("Sức chứa: "));
      const flight = type === "domestic"
        ? new DomesticFlight(flightNumber, origin, dest, time, cap)
        : new InternationalFlight(flightNumber, origin, dest, time, cap);
      manager.addFlight(flight);
      break;
    case 3:
      const pid = Number(prompt("ID hành khách: "));
      const fnum = prompt("Số hiệu chuyến bay: ");
      const tickets = Number(prompt("Số vé: "));
      const booking = manager.createBooking(pid, fnum, tickets);
      if (booking) console.log("Đặt vé thành công:", booking.getBookingDetails());
      else console.log("Đặt vé thất bại!");
      break;
    case 4:
      const bid = Number(prompt("ID booking cần hủy: "));
      manager.cancelBooking(bid);
      console.log("Đã hủy booking!");
      break;
    case 5:
      const o = prompt("Điểm đi: ");
      const d = prompt("Điểm đến: ");
      manager.listAvailableFlights(o, d);
      break;
    case 6:
      const pid2 = Number(prompt("ID hành khách: "));
      manager.listBookingsByPassenger(pid2);
      break;
    case 7:
      console.log("Doanh thu:", manager.calculateTotalRevenue());
      break;
    case 8:
      manager.countFlightsByType();
      break;
    case 9:
      const fn = prompt("Số hiệu chuyến bay: ");
      const nt = prompt("Giờ mới: ");
      manager.updateFlightTime(fn, nt);
      console.log("Đã cập nhật giờ bay!");
      break;
    case 10:
      const fn2 = prompt("Số hiệu chuyến bay: ");
      manager.getFlightPassengerList(fn2);
      break;
    case 11:
      console.log("Thoát chương trình...");
      process.exit(0);
  }
}
