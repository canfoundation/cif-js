/**
 * Eos name format https://eosio.github.io/eosio.cdt/latest/structeosio_1_1name/#struct-eosioname
 * /^[1-5a-z.]{1,12}$/g
 */
export type EosName = string;

/**
 * Sample 1: "10.0000 CAT"
 * Sample 2: "15.0005 EOS"
 */
export type Asset = string;
