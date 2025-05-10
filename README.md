# Admin Dashboard

A full-featured Admin Dashboard built with **Next.js**, **JavaScript**, **Tailwind CSS**, and **shadcn/ui**. This application provides a secure authentication system and a responsive UI for managing inventory data.

##  Features

-  **Sign-In Page**  
  Secure login with user ID and password.

-  **Inventory Management**  
  - View inventory in a structured table format  
  - Add new inventory entries  
  - Edit existing entries  
  - Update inventory status  
  - Delete entries

-  **User Management**  
  - Add users  
  - Edit user details  
  - Delete or update user status  

-  **Navigation**  
  - Full sidebar with navigation links  
  - Top AppBar with profile and logout options

-  **UI/UX**  
  - Responsive layout using Tailwind CSS  
  - Clean, modern interface using **shadcn/ui** components


-  **API**  
  - Successfully implemented the enquiry management system for your admin dashboard.
  - Pages:
/contact - Public-facing contact form
/dashboard/enquiries - Admin panel to view and manage enquiries
  - Contact form with validation for name, email, service, and message
  - Admin dashboard with table display of all enquiries
  - Sorting by any column
  - Action buttons (resolve, archive, delete)
  - Status management (new, in-progress, resolved, archived)

  - in local host this will all work but in server it will not work in similar way as Vercel functions spin up on demand → No long-lived memory.You cannot persist files between requests. Files written during one API call will be lost on the next.

##  Tech Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [shadcn/ui](https://ui.shadcn.com/)


