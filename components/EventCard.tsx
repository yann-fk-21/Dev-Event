import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string,
    image: string,
    slug: string,
    location: string,
    date: string,
    time: string,
    tags: string[],
}

const EventCard = ({title, image, slug, location, date, time, tags}: Props) => {
    return (
        <Link href={`/events/${slug}`}>
            <div className="event-card">
                <Image src={image} alt={title} width={410} height={300} className="poster"/>
                <p className="title">{title}</p>

                <div className="flex flex-row gap-2">
                    <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
                    <p>{location}</p>
                </div>

                <div className="datetime">
                    <div className="flex flex-row gap-2">
                        <Image src="/icons/calendar.svg" alt="calendar" width={14} height={14} />
                        <p>{date}</p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Image src="/icons/clock.svg" alt="clock" width={14} height={14} />
                        <p>{time}</p>
                    </div>
                </div>

                <div className="flex flex-row gap-2 flex-wrap mt-2">
                    {tags?.length > 0 && tags.slice(0, 3).map((tag, index) => (
                        <div className="pill text-xs" key={tag}>{tag}</div>
                    ))}
                </div>
            </div>
        </Link>
    )
}
export default EventCard
