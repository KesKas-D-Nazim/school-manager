import { userAuth } from "./users.service.js"



export const registerController = async (c: any) => {

    const user = await c.req.json()

    const response = await userAuth.register(user)

    if (!response) {
        return c.text("User already exists", 400)
    }
    return c.json(response, 201)
}

export const loginController = async (c: any) => {
    const user = await c.req.json()
    const response = await userAuth.login(user)
    if (!response) {
        return c.text("Invalid credentials", 401)
    }
    return c.json(response, 200)
}