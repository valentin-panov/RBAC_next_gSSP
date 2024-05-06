# Role-Based Access Control in React/Next application 
## Part 2: Protect the individual route: getServerSideProps

As we mentioned in the previous post, applications developed using React often encounter security vulnerabilities, particularly concerning the limitation of unauthorized access.

We have developed the demo application where the access control vulnerabilities have been implemented in the insufficient protection of routes and individual components. Specifically, the attacker's browser receives all JavaScript chunks that could be utilized on the page, including the administrator component, and only after receiving this code does the browser decide to restrict access. As a result, the attacker gains access to all code, even not intended for unauthorised users.
You may review the vulnerable application and explanation of its behavior via the links: \
https://rbac-next-standart.vercel.app/ \
https://github.com/valentin-panov/RBAC_next_standart

Today, I wish to elaborate on safeguarding against such vulnerabilities using the built-in functionality of Next.js. This publication is dedicated to fortifying the security of individual routes. 

Starting from version 9.3.0, each file responsible for rendering pages in Next.js can contain code that runs exclusively on the server before sending a response to the client. This is achieved through the function `getServerSideProps`. In the event of an unauthorized request, instead of sending the page code in the response, it is advisable to redirect the requesting user to the authentication page or any other secure path.

The code responsible for this may appears as follows:
```
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookies = cookieParse(context.req.headers.cookie);
  const token = cookies["access_token"];
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
```

In the provided example, I intentionally omit validation checks for the received token's validity and the bearer's possession of necessary permissions. However, I believe you can extrapolate these considerations yourself.

You can observe how such protection operates by following the link: https://rbac-next-g-ssp.vercel.app/. Note that the browser no longer "winks" with the protected page and does not disclose secured chunks of JavaScript code.

The advantage of this approach lies in its ability to selectively fortify only genuinely vulnerable routes, without introducing additional authorization checks across the entire application.

If you need to secure not just one page but a significant portion of paths in your application, there's good news for you – there's no need to rewrite each page individually. Protection can be applied broadly. How? That will be covered in the next publication. Stay tuned.

### Web version
https://rbac-next-g-ssp.vercel.app/

### Used fake API:
https://fakeapi.platzi.com/en/rest/users/

### P.S.
If you are attentive enough and "watch the hands," you may have noticed that one problem remains unresolved.\
It's the issue that the admin component is still loaded into the user's page and can be analyzed or even rendered if the attacker is meticulous enough to find the relevant variable in the client-side code.\
To address this issue, it is necessary to architecturally separate pages intended for users with different roles.\
If you require explanations, feel free to comment or message directly.
