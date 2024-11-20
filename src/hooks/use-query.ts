import { useLiveQuery } from "@electric-sql/pglite-react";
import type { Query } from "drizzle-orm";
import {
  Array,
  Data,
  Either,
  flow,
  pipe,
  Schema,
  type ParseResult,
} from "effect";
import { usePgliteDrizzle } from "./use-pglite-drizzle";

class MissingData extends Data.TaggedError("MissingData")<{}> {}
class InvalidData extends Data.TaggedError("InvalidData")<{
  parseError: ParseResult.ParseError;
}> {}

export const useQuery = <A, I>(
  query: (orm: ReturnType<typeof usePgliteDrizzle>) => Query,
  schema: Schema.Schema<A, I>
) => {
  const orm = usePgliteDrizzle();
  const { params, sql } = query(orm);
  const results = useLiveQuery<I>(sql, params);
  return pipe(
    results?.rows,
    Either.fromNullable(() => new MissingData()),
    Either.flatMap(
      flow(
        Schema.decodeEither(Schema.Array(schema)),
        Either.mapLeft((parseError) => new InvalidData({ parseError }))
      )
    )
  );
};

export const useQuerySingle = <A, I>(
  ...args: Parameters<typeof useQuery<A, I>>
) => {
  const results = useQuery(...args);
  return pipe(
    results,
    Either.flatMap(
      flow(
        Array.head,
        Either.fromOption(() => new MissingData())
      )
    )
  );
};
