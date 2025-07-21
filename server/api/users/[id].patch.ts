import prisma from "~/lib/prisma";

export default eventHandler(async (event) => {
    const username = getRouterParam(event, "id")

    if (!username) return setResponseStatus(event, 400)

    const body = await readBody(event)

    if (!body.password || !body.attributes.vlanId) return setResponseStatus(event, 400)

    await prisma.radCheck.updateMany({data: {value: body.password}, where: { username}, limit: 1})
    await prisma.radReply.updateMany({data: {value: body.attributes.vlanId}, where: { username, attribute: "Tunnel-Private-Group-Id"}, limit: 1})
})