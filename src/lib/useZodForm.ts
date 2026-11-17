"use client";

import { useState, useCallback, useMemo } from "react";
import { z, ZodError, type ZodType } from "zod";

export type FormErrors<T> = Partial<Record<Extract<keyof T, string>, string>>;

export interface UseZodFormResult<T> {
  data: Partial<T>;
  errors: FormErrors<T>;
  updateField: <K extends Extract<keyof T, string>>(field: K, value: T[K]) => void;
  validate: (field?: Extract<keyof T, string>) => boolean;
  validateAll: () => boolean;
  setFieldError: (field: Extract<keyof T, string>, message?: string) => void;
  handleSubmit: (onSubmit: (data: T) => Promise<void> | void) => Promise<boolean>;
  isSubmitting: boolean;
  setData: (values: Partial<T>) => void;
  reset: () => void;
}

/**
 * Bridges React state with a Zod schema.
 *
 * Validation runs `schema.safeParse` over the whole value object and then
 * filters by `issue.path[0]`, rather than reaching into `schema.shape[field]`.
 * Two reasons: Zod 4 exposes `error.issues` (not `error.errors`), and composite
 * schemas such as `z.intersection(...)` have no `.shape` at all, so the
 * per-field access would throw a TypeError on the first keystroke.
 */
export function useZodForm<S extends ZodType>(
  schema: S,
  /**
   * Seed values. Arrays and booleans should be seeded here rather than given
   * schema `.default()`s: in Zod 4 a default short-circuits validation when the
   * input is undefined, so `photos: z.array(...).min(3).default([])` would let an
   * empty photo list pass silently.
   */
  defaultValues: Partial<z.infer<S>> = {}
): UseZodFormResult<z.infer<S>> {
  type Values = z.infer<S>;
  type Field = Extract<keyof Values, string>;

  const [data, setDataState] = useState<Partial<Values>>(defaultValues);
  const [errors, setErrors] = useState<FormErrors<Values>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fields the user has left (or attempted to submit); errors only surface
  // for touched fields so the form is not red before any interaction.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  const issuesFor = useCallback(
    (values: unknown) => {
      const result = schema.safeParse(values);
      if (result.success) return [];
      const error: ZodError = result.error;
      return error.issues;
    },
    [schema]
  );

  const toErrorMap = useCallback((values: unknown): FormErrors<Values> => {
    const map: FormErrors<Values> = {};
    for (const issue of issuesFor(values)) {
      const key = issue.path[0];
      if (typeof key === "string" && !map[key as Field]) {
        map[key as Field] = issue.message;
      }
    }
    return map;
  }, [issuesFor]);

  const validate = useCallback(
    (field?: Field) => {
      const map = toErrorMap(data);
      if (field) {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors((prev) => ({ ...prev, [field]: map[field] }));
        return !map[field];
      }
      setErrors(map);
      setTouched((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(map) as Field[]) next[key] = true;
        return next;
      });
      return Object.keys(map).length === 0;
    },
    [data, toErrorMap]
  );

  const validateAll = useCallback(() => {
    const map = toErrorMap(data);
    setErrors(map);
    return Object.keys(map).length === 0;
  }, [data, toErrorMap]);

  const updateField = useCallback(
    <K extends Field>(field: K, value: Values[K]) => {
      setDataState((prev) => {
        const next = { ...prev, [field]: value };
        // Re-validate a field the user has already touched so a corrected
        // value clears its error immediately.
        if (touched[field]) {
          const map = toErrorMap(next);
          setErrors((prevErrors) => ({ ...prevErrors, [field]: map[field] }));
        }
        return next;
      });
    },
    [touched, toErrorMap]
  );

  const setFieldError = useCallback((field: Field, message?: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const setData = useCallback((values: Partial<Values>) => {
    setDataState((prev) => ({ ...prev, ...values }));
  }, []);

  const reset = useCallback(() => {
    setDataState(defaultValues);
    setErrors({});
    setTouched({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    async (onSubmit: (values: Values) => Promise<void> | void) => {
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        setErrors(toErrorMap(data));
        setTouched(
          Object.fromEntries(
            toErrorMap(data) ? Object.keys(toErrorMap(data)).map((k) => [k, true]) : []
          ) as Partial<Record<Field, boolean>>
        );
        return false;
      }
      setIsSubmitting(true);
      try {
        await onSubmit(parsed.data);
        return true;
      } finally {
        setIsSubmitting(false);
      }
    },
    [data, schema, toErrorMap]
  );

  // Only expose errors for touched fields.
  const visibleErrors = useMemo(() => {
    const out: FormErrors<Values> = {};
    for (const key of Object.keys(errors) as Field[]) {
      if (touched[key]) out[key] = errors[key];
    }
    return out;
  }, [errors, touched]);

  return {
    data,
    errors: visibleErrors,
    updateField,
    validate,
    validateAll,
    setFieldError,
    handleSubmit,
    isSubmitting,
    setData,
    reset,
  };
}
