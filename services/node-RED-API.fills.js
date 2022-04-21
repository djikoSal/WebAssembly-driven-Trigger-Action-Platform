module.exports = {
    RED_util_getMessageProperty: {
        getFn: (node) => {
            return (propName) => {
                if (!node || !node.msgProperties || !node.msgProperties.get) { throw Error('Platform error #1') }
                return (node.msgProperties.get(propName) || "");
            }
        },
        asc_import: "declare function RED_util_getMessageProperty(propName: string): string;",
        node_red: true
    },
    RED_util_setMessageProperty: {
        getFn: (node) => {
            return (propName, strVal) => {
                if (!node || !node.msgProperties || !node.msgProperties.get) { throw Error('Platform error #1') }
                node.msgProperties.set(propName, strVal);
            }
        },
        asc_import: "declare function RED_util_setMessageProperty(k: string, v: string): void;",
        node_red: true
    },
    node_send_msg: {
        getFn: (node) => {
            return () => {
                if (node && node.send) { node.send(); } // do whatever
            }
        },
        asc_import: "declare function node_send_msg(): void;",
        node_red: true
    },
    node_error: {
        getFn: (node) => {
            return (errMsg) => {
                if (node && node.send) { node.error(errMsg); } // do whatever
            }
        },
        asc_import: "declare function node_error(errMsg: string): void;",
        node_red: true
    },
}