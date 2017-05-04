### Installation
 1. npm install
 2. Add '127.0.0.1   local.francobot.com' to your /etc/hosts file (need to edit with sudo privileges)
 3. Start nginx with 'npm run startnginx'
 4. Start the node server with 'npm run start'
 5. In a browser, go to http://local.francobot.com/bot/talk

### User Stories
 - **FRANCO** greets **USER** by asking what **USER** would like to find
 - Franco pulls appropriate category with any initial queries
 - If initial query does not include size **FRANCO** asks **USER** for size
 - **FRANCO** shows options in **sets of four**
 - **FRANCO** allows **USER** to further narrow by **occasion** and/or **color** and/or **fit** if not included in initial query
 - **USER** can type _next_ or _previous_ and **FRANCO** paginates query items in **sets of four**
 - **USER** can select single item
 - **USER** can update sku's of single item once selected
 - **FRANCO** asks **USER** if s/he would like to ad selected item to cart
 - **FRANCO** confirms items and sku info before adding to cart
 - **FRANCO** asks **USER** if s/he would like to find any additional items
 - **FRANCO** either asks what **USER** would like to find or exits 
