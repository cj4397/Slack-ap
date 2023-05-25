import Link from "next/link"


export default function Dashboardlayout(
    props: {
        children: React.ReactNode
    }
) {
    return (
        <>
            <section>
                <h1>Side Navaigation</h1>
                <nav id="sidenav">
                    <Link href={'/dashboard'}>Home</Link>
                    <Link href={'/dashboard/DM'}>Direct Message</Link>
                    <Link href={'/dashboard/search'}>Search</Link>
                    <Link href={'/dashboard/profile'}>Profile</Link>
                </nav>

            </section>

            <section>
                {props.children}
            </section>
        </>
    )
}