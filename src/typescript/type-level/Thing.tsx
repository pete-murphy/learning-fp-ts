type ExampleForm = {
  fieldA: boolean
  fieldB: number
  fieldC: "foo" | "bar" | "baz"
}

const Form = () => (
  <form>
    {/* This one's valid, yeeeahy */}
    <FormField<ExampleForm> name="fieldA" />
    {/* This one errors because not a key in the form, yeay */}
    <FormField<ExampleForm> name="notAValidFieldName" />
  </form>
)

type FormFieldProps<FormState extends Record<string, unknown>> = {
  name: Extract<keyof FormState, string>
}

const FormField = <FormState extends Record<string, unknown>>(
  props: FormFieldProps<FormState>
) => <input name={props.name} />
