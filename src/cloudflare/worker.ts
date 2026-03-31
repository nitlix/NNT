export default {
    async fetch(request: Request) {
        return new Response('Hello, world!');
    },
} satisfies ExportedHandler<Env>;