import prisma from "~/lib/prisma";

export default eventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
    if (!body.user || !body.password || !body.attributes?.vlanId) return setResponseStatus(event, 400)

    await prisma.radCheck.create({
        data: {
            username: body.user,
            op: ":=",
            attribute: "Cleartext-Password",
            value: body.password
        }
    })
    await prisma.radReply.createMany({
        data: [{
            username: body.user,
            op: "=",
            attribute: "Tunnel-Type",
            value: "VLAN"
        },{
            username: body.user,
            op: "=",
            attribute: "Tunnel-Medium-Type",
            value: "IEEE-802"
        },{
            username: body.user,
            op: "=",
            attribute: "Tunnel-Private-Group-Id",
            value: body.attributes.vlanId
        }]
    })
    setResponseStatus(event, 201)
})