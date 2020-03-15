export default async () => {
    try {
        const result = await fetch('./api/v1/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                variables: {},
                query: `
          {
            __schema {
              types {
                kind
                name
                possibleTypes {
                  name
                }
              }
            }
          }
        `,
            }),
        })
        const schema = await result.json()
        schema.data.__schema.types = schema.data.__schema.types.filter(type => type.possibleTypes !== null,);
        return schema.data
    }
    catch (e) {
        return false;
    }
}