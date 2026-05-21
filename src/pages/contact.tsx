import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MessageCircle, Calendar, Clock, Users, MapPin } from "lucide-react";
import Link from "next/link";

const AVAILABLE_DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const TIME_SLOTS = [
  "06:00 AM - 08:00 AM",
  "08:00 AM - 10:00 AM", 
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
  "08:00 PM - 10:00 PM"
];

export default function Contact() {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [eventType, setEventType] = useState("");
  const [expectedAthletes, setExpectedAthletes] = useState("");

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      eventName: (e.target as any).eventName.value,
      eventType,
      eventDate: (e.target as any).eventDate.value,
      eventLocation: (e.target as any).eventLocation.value,
      expectedAthletes,
      selectedDay,
      selectedTime,
      organizerName: (e.target as any).organizerName.value,
      organizerPhone: (e.target as any).organizerPhone.value,
      organizerEmail: (e.target as any).organizerEmail.value,
      specialRequirements: (e.target as any).specialRequirements.value,
      amount: calculateAmount()
    };

    // Razorpay Integration
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with actual Razorpay key
      amount: formData.amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "CryoRevive",
      description: `Event Recovery Session - ${formData.eventName}`,
      image: "/favicon.ico",
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // Send booking confirmation email with payment details
        console.log("Booking confirmed:", { ...formData, paymentId: response.razorpay_payment_id });
      },
      prefill: {
        name: formData.organizerName,
        email: formData.organizerEmail,
        contact: formData.organizerPhone
      },
      notes: {
        event_name: formData.eventName,
        event_date: formData.eventDate,
        athletes: formData.expectedAthletes
      },
      theme: {
        color: "#33B5E5"
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const calculateAmount = () => {
    const athleteCount = parseInt(expectedAthletes) || 0;
    const basePrice = 5000; // Base event booking fee
    const perAthletePrice = 500;
    return basePrice + (athleteCount * perAthletePrice);
  };

  return (
    <>
      <SEO 
        title="Book CryoRevive for Your Event | Post-Event Recovery Sessions"
        description="Invite CryoRevive to your athletic event. Professional cold plunge and recovery sessions for athletes. Event-based recovery services across India."
      />
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      <Navigation />
      <main className="min-h-screen bg-background">
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-sm mb-6">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Event-Based Recovery
                </p>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                Book Us for Your Event
              </h1>
              <p className="text-lg text-muted-foreground">
                We bring professional recovery sessions to your athletic event. Cold plunge therapy, contrast recovery, and mobile units available for marathons, tournaments, and competitions.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-6">Book Post-Event Recovery Session</h2>
                  <Card className="bg-card border-border">
                    <CardContent className="p-8">
                      <form onSubmit={handleBookingSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="eventName" className="text-sm font-semibold text-foreground">
                            Event Name *
                          </label>
                          <Input 
                            id="eventName"
                            type="text" 
                            placeholder="e.g., Delhi Half Marathon 2026"
                            className="bg-background border-border"
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="eventType" className="text-sm font-semibold text-foreground">
                              Event Type *
                            </label>
                            <select
                              id="eventType"
                              value={eventType}
                              onChange={(e) => setEventType(e.target.value)}
                              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                              required
                            >
                              <option value="">Select event type</option>
                              <option value="marathon">Marathon / Running Event</option>
                              <option value="triathlon">Triathlon</option>
                              <option value="cycling">Cycling Race</option>
                              <option value="crossfit">CrossFit Competition</option>
                              <option value="sports">Sports Tournament</option>
                              <option value="other">Other Athletic Event</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="eventDate" className="text-sm font-semibold text-foreground">
                              Event Date *
                            </label>
                            <Input 
                              id="eventDate"
                              type="date" 
                              className="bg-background border-border"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="eventLocation" className="text-sm font-semibold text-foreground">
                            Event Location *
                          </label>
                          <Input 
                            id="eventLocation"
                            type="text" 
                            placeholder="City, State"
                            className="bg-background border-border"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="expectedAthletes" className="text-sm font-semibold text-foreground">
                            Expected Number of Athletes *
                          </label>
                          <Input 
                            id="expectedAthletes"
                            type="number" 
                            placeholder="e.g., 50"
                            value={expectedAthletes}
                            onChange={(e) => setExpectedAthletes(e.target.value)}
                            className="bg-background border-border"
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              Preferred Day *
                            </label>
                            <select
                              value={selectedDay}
                              onChange={(e) => setSelectedDay(e.target.value)}
                              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                              required
                            >
                              <option value="">Select day</option>
                              {AVAILABLE_DAYS.map((day) => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <Clock className="h-4 w-4 text-accent" />
                              Preferred Time Slot *
                            </label>
                            <select
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                              required
                            >
                              <option value="">Select time</option>
                              {TIME_SLOTS.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="organizerName" className="text-sm font-semibold text-foreground">
                              Organizer Name *
                            </label>
                            <Input 
                              id="organizerName"
                              type="text" 
                              placeholder="Your name"
                              className="bg-background border-border"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="organizerPhone" className="text-sm font-semibold text-foreground">
                              Phone Number *
                            </label>
                            <Input 
                              id="organizerPhone"
                              type="tel" 
                              placeholder="9891430920"
                              className="bg-background border-border"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="organizerEmail" className="text-sm font-semibold text-foreground">
                            Email Address *
                          </label>
                          <Input 
                            id="organizerEmail"
                            type="email" 
                            placeholder="organizer@event.com"
                            className="bg-background border-border"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="specialRequirements" className="text-sm font-semibold text-foreground">
                            Special Requirements
                          </label>
                          <Textarea 
                            id="specialRequirements"
                            placeholder="Any specific needs, accessibility requirements, or additional services..."
                            className="bg-background border-border min-h-[100px]"
                          />
                        </div>

                        {expectedAthletes && (
                          <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Estimated Cost:</strong>
                                <br />
                                Base Event Fee: ₹5,000
                                <br />
                                Per Athlete (×{expectedAthletes}): ₹{parseInt(expectedAthletes) * 500}
                                <br />
                                <span className="text-lg font-bold text-primary">
                                  Total: ₹{calculateAmount().toLocaleString('en-IN')}
                                </span>
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        <Button 
                          type="submit"
                          size="lg"
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        >
                          Proceed to Payment (Razorpay)
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          Secure payment via Razorpay. We'll confirm your booking within 24 hours.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-accent/10 border-accent/30">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/20 w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-bold mb-2">
                          Quick Event Inquiry
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Have questions? Chat with us on WhatsApp
                        </p>
                        <a 
                          href="https://wa.me/919891430920?text=Hi%2C%20I%27d%20like%20to%20book%20CryoRevive%20for%20my%20event"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold rounded-sm transition-colors"
                        >
                          Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <Card className="bg-card border-border">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold mb-1">Main Office</h3>
                            <p className="text-sm text-muted-foreground">
                              B-94, Sector 36<br />
                              Greater Noida<br />
                              Uttar Pradesh, India
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-accent/10 w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0">
                            <Phone className="h-6 w-6 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold mb-1">Mobile</h3>
                            <a 
                              href="tel:+919891430920" 
                              className="text-sm text-primary hover:underline"
                            >
                              +91 9891430920
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0">
                            <Mail className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold mb-2">Email</h3>
                            <div className="space-y-1">
                              <a 
                                href="mailto:info@cryorevive.in" 
                                className="text-sm text-primary hover:underline block"
                              >
                                info@cryorevive.in
                              </a>
                              <a 
                                href="mailto:support@cryorevive.in" 
                                className="text-sm text-primary hover:underline block"
                              >
                                support@cryorevive.in
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <h3 className="text-xl font-display font-bold">What We Bring to Your Event</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Professional Setup</p>
                        <p className="text-xs text-muted-foreground">Mobile cold plunge units & trained recovery specialists</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Flexible Timing</p>
                        <p className="text-xs text-muted-foreground">Sessions scheduled around your event timeline</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-accent/10 w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Scalable Service</p>
                        <p className="text-xs text-muted-foreground">From 10 to 500+ athletes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Current Phase: Event-Based Recovery Sessions
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're focusing on bringing professional recovery to athletic events across India. Invite us to your next marathon, tournament, or competition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Book Your Event
              </Button>
              <Link href="/services">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}