const process = require('node:process');
const { parentPort } = require('node:worker_threads');
const { Ollama } = require('ollama')
const GhostAdminAPI = require('@tryghost/admin-api');
const path = require('path');
const Cabin = require('cabin');
const Axe = require('axe');
const { Signale } = require('signale');


const ollama = new Ollama({ host: `http://${process.env.LLAMA_HOST}:${process.env.LLAMA_PORT}` })

const api = new GhostAdminAPI({
  url: process.env.ADMIN_URL,
  key: process.env.ADMIN_API_KEY,
  version: "v5.0",
});

const logger = new Axe({
  logger: new Signale(),
  meta: {
    omittedFields: [ 'app' ]
  }
});

const cabin = new Cabin({logger});

const botKnowledge = process.env.BOT_KNOWLEDGE
const botName = process.env.BOT_NAME

function cancel() {
  // do cleanup here
  // (if you're using @ladjs/graceful, the max time this can run by default is 5s)

  // send a message to the parent that we're ready to terminate
  // (you could do `process.exit(0)` or `process.exit(1)` instead if desired
  // but this is a bit of a cleaner approach for worker termination
  if (parentPort) parentPort.postMessage('cancelled');
  else process.exit(0);
}

if (parentPort)
  parentPort.once('message', message => {
    if (message === 'cancel') return cancel();
  });

// Function to generate title for content based on knowledge
async function generateTitle() {
    try {
        let titlePrompt = `Create a single unique title for an article about ${botKnowledge}. Provide only the tile, no commentary`
        const responseStream = await ollama.generate({
            model: process.env.LLAMA_TITLE_MODEL,
            prompt: titlePrompt,
            options: {
                maxTokens: 300,
                temperature: 0.7,
                stop: ["\n"]
            },
            stream: true
        });

        let fullResponse = '';
        for await (const data of responseStream) {
            if (data.done) {
                break
            };
            fullResponse += data.response;
        }

        let title = fullResponse.trim();
        title = title.replaceAll("^\"|\"$", "");
        cabin.success(`Title: ${title}`)

        return title;
    } catch (error) {
        //cabin.error(new Error('Error generating content: ' + error))
        cabin.error('Error generating content:', error);
        throw error;
    }
}

// Function to generate HTML content and based on title using the ollama API
async function generateContent(titlePrompt) {
    try {
        let prompt_string = `Your name is ${botName}, and you are a blogger with extensive knowledge on ${botKnowledge}. \
Generate the content for a daily ${botKnowledge} blog post for the article titled ${titlePrompt} \
The content should be wrapped in an article HTML element and include appropriate HTML markup within. Including paragraph elements. \
Do not include the title of the post in the content.`

        const responseStream = await ollama.generate({
            model: process.env.LLAMA_CONTENT_MODEL,
            prompt: prompt_string,
            options: {
                maxTokens: 600,
                temperature: 0.7,
                stop: ["</article>"]
            },
            stream: true
        });

        let fullResponse = '';
        for await (const data of responseStream) {
            if (data.done) {
                break
            };
            fullResponse += data.response;
        }

        const text = fullResponse.trim()
        const html = text + "</article>";
        //cabin.info(`Content: ${html}`)
        console.log(`Content: ${html}`)

        return html;
    } catch (error) {
        //cabin.error(new Error('Error generating content:', error));
        console.error('Error generating content:', error);
        throw error;
    }
}

// Main function to generate, process, and post content
(async () =>  {
    try {
        cabin.info(`${botName} is generating a title for the content now (this may take some time if llama running on CPU)`)
        const title = await generateTitle();
        cabin.info(`${botName} is generating content for title:${title} now (this may take some time if llama running on CPU)`)
        const html = await generateContent(title);

        cabin.info(`Submitting ${botName}'s responses to Ghost`)
        const result = await api.posts.add(
            { title, html },
            { source: 'html' } // Tell the API to use HTML as the content source, instead of Lexical
        );
        if (result) {
            //cabin.info(`Done`)
            cabin.success("Done")
            if (parentPort) parentPort.postMessage('done');
            else process.exit(0);
        } else {
            //cabin.info(`Ghost returned nothing`)
            cabin.info("Ghost returned nothing");
            process.exit(1);
        }
        //console.log(JSON.stringify(result));
    } catch (error) {
        cabin.error(error);
        process.exit(1);
    }
})();
