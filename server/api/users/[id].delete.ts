import prisma from "~/lib/prisma";

export default eventHandler(async (event) => {
    const username = getRouterParam(event, "id")

    if (!username) return setResponseStatus(event, 400)

    const c1 = await prisma.radCheck.deleteMany({where: {username}})
    const c2 = await prisma.radReply.deleteMany({where: {username}})
    return {count: c1.count + c2.count}
})