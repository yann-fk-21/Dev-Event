import {notFound} from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import {getSimilarEvents} from "@/lib/actions/event.actions";
import {getBookingCount} from "@/lib/actions/booking.actions";
import {IEvent} from "@/database/event.model";
import EventCard from "@/components/EventCard";
import {cacheLife} from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsItem = ({icon, alt, label}: {icon: string, alt: string, label: string}) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({agendaItems}:{agendaItems: string[]}) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems?.length > 0 && agendaItems.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({tags}:{tags: string[]}) => (
    <div className="flex flex-row gap-2 flex-wrap">
        {tags?.length > 0 && tags.map((tag, index) => (
            <div className="pill" key={tag}>{tag}</div>
        ))}
    </div>
)

const EventDetailsPage = async ({params}:{params: Promise<{slug: string}>}) => {
    'use cache'
    cacheLife('hours')

    const {slug} = await params;
    const request = await fetch(`${BASE_URL}/api/events/${slug}`);

    const {event} = await request.json();

    if(!event) return notFound();

    const similarEvents: IEvent[] = await getSimilarEvents(slug)

    const bookings = await getBookingCount(slug);

    return (
        <section id="event">
            <div className="header">
                <h1>{event.title}</h1>
                <p className="mt-2">{event.description}</p>
            </div>

        {/*    Left side - Event Content */}
            <div className="details">
                <div className="content">
                    <Image src={event.image} alt={event.title} width={800} height={800} className="banner"/>
                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{event.overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        {/*<p>{event.details}</p>*/}
                        <EventDetailsItem icon={"/icons/calendar.svg"} alt={"calendar"} label={event.date}/>
                        <EventDetailsItem icon={"/icons/clock.svg"} alt={"clock"} label={event.time}/>
                        <EventDetailsItem icon={"/icons/pin.svg"} alt={"location"} label={event.location}/>
                        <EventDetailsItem icon={"/icons/mode.svg"} alt={"mode"} label={event.mode}/>
                        <EventDetailsItem icon={"/icons/audience.svg"} alt={"audience"} label={event.audience}/>
                    </section>

                    <EventAgenda agendaItems={event.agenda}/>

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{event.organizer}</p>
                    </section>

                    <EventTags tags={event.tags}/>
                </div>

                {/*    Right side - Booking Form */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book your spot</h2>
                        {bookings > 0 ? (
                            <p>Joins {bookings} people who have already booked their spot!</p>
                        ): (
                            <p className="text-sm">Be the first to book your spot!</p>
                        )}

                        <BookEvent eventId={event._id} slug={event.slug}/>
                    </div>
                </aside>
            </div>

            {similarEvents.length > 0 && (
                <div className="flex flex-col gap-5 mt-10">
                    <h2>Similar Events</h2>
                    <ul className="events list-none">
                        {similarEvents.map((event: IEvent) => (
                            <li key={event.slug}>
                                <EventCard {...event} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    )
}
export default EventDetailsPage
