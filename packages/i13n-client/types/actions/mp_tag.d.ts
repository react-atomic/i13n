export default mpTag;
declare function mpTag({ store, bCookieIndex, lazeInfoIndex, mpHost, send, }: {
    store: any;
    bCookieIndex: any;
    lazeInfoIndex: any;
    mpHost: any;
    send?: typeof mysend;
}): void;
import mysend from "../libs/send";
