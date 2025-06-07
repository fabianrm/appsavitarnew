export interface Profile {
    ".id": string;
    "name": string;
    "bridge-learning": string;
    "use-ipv6": string;
    "use-mpls": string;
    "use-compression": string;
    "use-encryption": string;
    "only-one": string;
    "change-tcp-mss": string;
    "use-upnp": string;
    "address-list": string;
    "on-up": string;
    "on-down": string;
    default: string;
    "rate-limit"?: string;
}
