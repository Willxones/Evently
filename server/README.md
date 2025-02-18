# Local Development Setup Instructions

## First steps

Clone the repository from Gtihub

```
git clone https://github.com/Willxones/Evently.git
```

Ensure you are working on a feature branch off of development.

Note that this is a monorepo so whilst any git commands should be run in 'Evently', everything else should happen within Evently/server.

Install dependencies in the server application

```
cd server
npm install
```

## Supabase Setup

Whilst developing evently, you will need to use a local Supabase Postgres database.

Install Docker Desktop at https://docs.docker.com/desktop/setup/install/mac-install/ for mac or https://docs.docker.com/desktop/setup/install/windows-install/ for windows.

Docker should start automatically, but ensure that it is running, and then install supabase

MacOS Homebrew:

```
brew install supabase/tap/supabase
```

Windows Scoop:

```
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Now start Supabase within the server application.

```
supabase start
```

The database port should be the same as that in the .env.example file, but if not then take the outputted DB port and use that instead.

Apply migrations to get the latest database structure.

```
supabase migration up
```

You can get a visual representation of your database here http://localhost:54323/project/default/database/schemas

## Start the server

Run the application by using the following command in the server directory

```
docker-compose up --build
```

If you have not made any configuration changes you can run this instead

```
docker-compose up
```

After you have finished you may want to prune docker to remove all the unused containers, volumes and networks. Only use the volumes tag if you are happy to delete all of the saved data which includes node_modules in this case.

```
docker-compose down
docker system prune --volumes
```
