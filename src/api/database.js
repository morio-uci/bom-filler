import knex from 'knex'

import {client, connection, migrations, seeds} from '../../knexfile'

export default knex({client: client, connection: connection, migrations: migrations, seeds: seeds})
