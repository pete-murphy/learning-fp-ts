import {
  taskEither as TE,
  readerTaskEither as RTE,
  either as E,
  option as O,
} from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";

type Customer = {};
type Dependencies = {
  getCustomerFromDB: (userId: string) => Promise<Customer | null>;
  createNewCustomer: (userId: string) => Promise<Customer>;
};
type WorkflowErrors = CustomerServiceIsDown | ValidationFailed | CustomerIsNull;

class CustomerIsNull {}
class CustomerServiceIsDown {}
class ValidationFailed {
  constructor(x: any, y: any) {}
}

const getCustomerId =
  (userId: string): RTE.ReaderTaskEither<Dependencies, WorkflowErrors, any> =>
  deps =>
    pipe(
      TE.tryCatch(
        () => deps.getCustomerFromDB(userId),
        () => new CustomerServiceIsDown(),
      ),
      TE.chainW(
        flow(
          TE.fromNullable(new CustomerIsNull()),
          TE.altW(
            () => TE.tryCatch(() => deps.createNewCustomer(userId),
            () => new CustomerServiceIsDown())
          ),
        ),
      ),
      TE.
      // TE.chainW(customer => ...)
      // (
      //   (customerOrNull): customerOrNull is Customer => customerOrNull !== null,
      //   () => new CustomerIsNull()
      // ),
      // TE.filterOrElse(
      //   (customerOrNull): customerOrNull is Customer => customerOrNull !== null,
      //   () => new CustomerIsNull()
      // ),
      // TE.chainW
      // TE.chainW(customer =>

      // )
      // TE.chainW(customerOrNull =>
      //   pipe(
      //     customerOrNull,
      //     TE.fromNullable(
      //       TE.tryCatch(
      //         () => pipe(userId, deps.createNewCustomer),
      //         () => new CustomerServiceIsDown(),
      //       ),
      //     ),
      //     TE.chainW(customer =>
      //       pipe(
      //         customer,
      //         Customer.decode,
      //         E.mapLeft(errs => new ValidationFailed(errs, workflowPath)),
      //         E.map(validCustomer => validCustomer.customerId),
      //         TE.fromEither,
      //       ),
      //     ),
      //   ),
      // ),
    );
