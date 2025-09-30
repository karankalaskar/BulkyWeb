export default async function Docs({params}: {params: Promise< {slug?: string[]}>
})
{

     const {slug} = await params;
     if( slug?.length == 2)
     {
        return <h1>Viewing Docs {slug[0]} - {slug[1]}</h1>
     }
     else if( slug?.length == 1)
     {
        return <h1>Viewing Docs {slug[0]}</h1>
     }
     return <h1>Viewing Docs Home</h1>
}