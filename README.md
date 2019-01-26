# helpdesk

[![Build status](https://ci.appveyor.com/api/projects/status/l1dapsf26x4x3omi?svg=true)](https://ci.appveyor.com/project/danleyb2/helpdesk)

#### Requirements

MongoDB v3.2+.


#### Setup
copy/rename .env.template into .env  
```bash
mv .env.template .env
```

edit/update the following .env fields
- DB_HOST

if need to also send emails and have 2 way email conversations like in github issues 
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASSWORD

2 way email conversations won't without the [Helpdesk Mail Server](https://github.com/danleyb2/helpdesk_mail_server) to forward the emails to specific 
tickets' conversation.  

