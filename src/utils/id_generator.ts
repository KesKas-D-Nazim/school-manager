import { init } from "@paralleldrive/cuid2"

const generateId = init({ length: 12 })

export default generateId;