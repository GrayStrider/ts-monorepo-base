import faker from 'faker'
import gql from 'graphql-tag'
import {times} from 'lodash'
import {GraphQLClient} from 'graphql-request'
import {print} from 'graphql'
import {Countries} from './CountriesList'
import {bb} from '@/utils/libsExport'
import {SERVER_URL} from 'config/_consts'
import {UserCreateInput} from '@/models/UsersPlayground/user.inputs'
import {flattenObject} from '@/utils/zz_misc/flattenObject'

const query = gql`mutation userCreate($input: UserCreateInput!) {
    userCreate(userData: $input) {
        createdDate
        id
        firstName
        lastName
        password
        email
        country
        age
    }
}`

export async function generateMockUsers (amount: number) {
	
	const fakes = times(amount, () => ({
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		password: faker.internet.password(),
		email: faker.internet.exampleEmail(),
		country: faker.random.arrayElement(Object.keys(Countries)),
		age: faker.random.number({max: 150, min: 18}),
	} as UserCreateInput))
	
	const endpoint = `${SERVER_URL}/users`
	const testClient = new GraphQLClient(endpoint, {
		headers: {
			authorization: 'internal_call',
		},
	})
	const generated = await bb.all(
		fakes.map(async fake => testClient
			.request(print(query), {input: fake})
			.then(flattenObject))
	)
	
	return {
		fakes,
		generated,
	}
	
}

