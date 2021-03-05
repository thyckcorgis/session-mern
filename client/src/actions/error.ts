export const RECEIVE_ERRORS = "RECEIVE_ERRORS";
export const CLEAR_ERRORS = "CLEAR_ERRORS";

interface Error {
  message: string;
}
export const receiveErrors = <T extends Error>({ message }: T) => ({
  type: RECEIVE_ERRORS,
  message,
});

export const clearErrors = () => ({ type: CLEAR_ERRORS });
