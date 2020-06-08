export interface SignTrxPayload {
  signatures: [string];
  serializedTransaction: Unit8Array;
  transactionId: string;
  clientMutationId: string;
}
