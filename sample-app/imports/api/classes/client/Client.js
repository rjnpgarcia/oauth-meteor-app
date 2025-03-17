import Watcher from "./Watcher";

class Client extends Watcher {
    constructor() {
        super();
        this.secureTransaction();
    }
}

export default new Client();
