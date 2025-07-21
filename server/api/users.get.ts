import prisma from "~/lib/prisma";

interface IDevice {
    id: number
    username: string;
    password: string
    attributes: {
        id?: number
        name: string;
        op: string;
        value: string;
    }[]
}

export default eventHandler(async () => {

    const ret: IDevice[] = [];
    const user = await prisma.radCheck.findMany()
    const reply = await prisma.radReply.findMany()

    const tempUser: Record<string, IDevice> = {}

    user.forEach(el => {
        //todo fix: could be overwritten!!
        const u: IDevice = <any>{}
        u.id = el.id
        u.username = el.username
        if (el.attribute ===  "Cleartext-Password") {
            u.password = el.value
        }
        u.attributes = []
        tempUser[el.username] = u
    })

    reply.forEach(el => {
        if (tempUser[el.username]) {
            tempUser[el.username].attributes.push({
                id: el.id,
                name: el.attribute,
                op: el.op,
                value: el.value
            })
        }
    })
    // console.log(tempUser)

    for (const el of Object.keys(tempUser)) {
        // console.log(el)
        ret.push(tempUser[el])
    }

    // console.log("ret", ret)



    return ret;

})