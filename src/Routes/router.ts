import express, { Response, Request } from "express"
import Converter from "../services/converter";
import rateLimit from "express-rate-limit"
// import apicache from "apicache"
const Router = express.Router()


const errorMessage = ({ amount, from, to }: { amount: number, from: string, to: string }): string => {
    return `Kindly checked passed parameter \n You passed amount : ${amount} with type ${typeof amount} \n , from : ${from} with type ${typeof from} \n , to : ${to} with type ${typeof to}`
}
const getLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



Router.get("/:from/:to/:amount", getLimiter ,  (req: Request, res: Response) => {
    const { from, to, amount } = req.params;
    // by default this is the free tier
    if (from != to && parseInt(amount) > 0) {
        (new Converter(from, to, parseInt(amount)).swapper() as any)
            .then((data: any) => (res as any).json({
                convertedValue: data,
                from,
                to,
                success: true,
                error: null,
            }))
            .catch((error: any) => res.json({
                success: false,
                error: errorMessage({ amount: (parseInt(amount)), from, to })
            }))
    } else {
        (res as any).json({
            success: false,
            error: errorMessage({ amount: (parseInt(amount)), from, to })
        })
    }
})
Router.post("/", (req: Request, res: Response) => {
    const { from, to, amount } = req.body[0];
    if (from != to && parseInt(amount) > 0) {
        (new Converter(from, to, parseInt(amount)).swapper() as any)
            .then((data: any) => (res as any).json({
                convertedValue: data,
                from,
                to,
                success: true,
                error: null,
            }))
            .catch((error: any) => res.json({
                success: false,
                error: errorMessage({ amount, from, to })
            }))
    } else {
        (res as any).json({
            success: false,
            error: errorMessage({ amount, from, to })
        })
    }
})

export default Router;