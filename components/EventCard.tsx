import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string,
    image: string,
    slug: string,
    location: string,
    date: string,
    time: string,
}

const EventCard = ({title, image, slug, location, date, time}: Props) => {
    return (
        <Link href={`/events/${slug}`}>
            <div>
                <Image src={image} alt={title} width={410} height={300} className="h-[300px] w-full rounded-lg object-cover"/>
                <p className="text-[20px] font-semibold line-clamp-1">{title}</p>

                <div className="flex flex-row gap-2">
                    <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
                    <p>{location}</p>
                </div>

                <div className="datetime">
                    <div className="flex flex-row gap-2">
                        <Image src="/icons/calendar.svg" alt="location" width={14} height={14} />
                        <p>{date}</p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Image src="/icons/clock.svg" alt="location" width={14} height={14} />
                        <p>{time}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default EventCard
