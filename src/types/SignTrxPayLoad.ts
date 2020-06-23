export interface SignTrxPayload {
  signatures: [string];
  serializedTransaction: any;
  transactionId: string;
  clientMutationId: string;
}
