export interface BlogPost {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD, no time — matches how it's displayed
  content: string; // paragraphs split on blank lines; [label](url) and **bold** supported
}

export const posts: BlogPost[] = [
  {
    slug: 'autonomous-programming-workflows',
    title: 'Autonomous Programming Workflows For Designing Software Systems',
    date: '2026-09-04',
    content: `This essay is dedicated to discussing the development of AI systems using autonomous programming tools (such as Claude Code which I will refer to as Claude). I want to divide this discussion into two main yet nested ideas where the main concept is how we bring the notion of self-improvement on building software systems to reality. I believe that the two ideas that tie together are defining the right workflow and verifying the system, where I believe that the verifying is nested into the workflow, yet is a strong concept that completes the autonomous part of the workflow. In my mind this is a parallel to an ML project: EDA followed by Data Engineering followed by Modeling followed by Metric Scoring, then rinse and repeat steps accordingly.

This brings me to the first idea. The idea is to define the **right workflow**. Workflow refers to a defined set of (md/yaml) files to which Claude must adhere throughout the development of said software system. Although this also introduces the idea of human-in-the-loop, when it is right for the human to jump in and give their thoughts, answer questions that Claude might have- I will save this for a future discussion.

System design is paramount and must be well defined initially in order to allow the developer to commit resources such as tokens, compute, money, and time in an efficient yet effective manner bringing the system to life. In addition, when thinking about the "right workflow", we don't want Claude making all the system design decisions, or trying to automate everything in one go and have the human developer prompt it to success (vibecode). The main reason is that this leads to either a very convoluted system that no one understands or a system which will never reach its potential.

I believe it's important that the developer control the design of the system being built. When it comes to thinking of subcomponents of a system we need to think of what components need to be static vs dynamic. Let me clarify: static means set in stone. The component does X, Y, and Z and nothing else. This isn't to say that the implementation must be done in a specific way, but the component must be concrete. Whereas dynamic in this case refers to components whose inputs/outputs are flexible and can change and thus we can allow Claude to have more autonomy over decisions for those components.

Furthermore, compartmentalization is a very important aspect of the workflow of building these systems. We don't want to fall into the rabbit hole of not following the construction of the system and prompting Claude to success. The big picture design and/or paradigm of the system should be split into multiple well defined subcomponents that Claude can focus on throughout the automated programming process. The analogy I'd use here is regarding humans. When it comes to executing tasks, a human can only really focus on one task at a time. Once one tries to do more than one task at a time we end up context switching between each task. I believe the idea is similar for Claude, each instance of Claude should be focused on one component of the system or to be more granular on a specific task. One of the strengths here is the ability of Claude to spawn subagents where there can be an orchestrator that directs its subagents on their tasks.

The second idea is the ability for Claude to **verify the capabilities of a built system** throughout its development. First we must understand the task/problem that we are solving. Therefore, as developers we must define our research question (or the general task that we are solving). Let's think hypothetically that the system we are building is a black box, therefore we need to understand what the input and output are. It is important to define the input and output well before we can think about the implementation of the black box, as the development of the system is dependent on the definition of the input and output. Furthermore, understanding the technical details of what kind of files/object types is essential to this process, since these will be the input/output that the system will rely on and changing this later on in the project can become expensive when it comes to resources.

For example, on the MACalendar project I am working on- in short this project is a calendar for which there is an AI system where the input is a set of audio clips (plus timestamps per clip) and output is an instance of the calendar + todo list (essentially a .db file). To verify the system, I built a dataset from [HWU-64](https://github.com/xliuhw/NLU-Evaluation-Data) (Liu, Eshghi, Swietojanski & Rieser, IWSDS 2019) to create a match between defined input and output which the AI system is built for. Also very important is to have the right metrics to score the output of the AI system in relation to the ground truth of the given dataset. Without going into too much depth, accuracy and other base metrics are not enough, especially when discussing complex input and output types, this includes many different variables/tags where some are deterministic and others subjective. For example, when comparing a subjective sentence in human language for a calendar event description or todo task item, there is more than one way to write a description or todo task item that would be correct.

This project has multiple challenges, and if I just prompt Claude until it succeeds there will likely be multiple issues: a convoluted system that is most likely broken, and an illegible system architecture. This speaks to a lack of critical thinking by the developer, which to me is a mandatory requirement. At the end of the day I believe that the human innovative and creative thinking is the most critical component when it comes to building systems. The reasoning is that if we can't bring our vision and ideas to the development of the system then there isn't much point in programming via agentic harnesses (e.g. vibecoding, agentic coding etc…). Therefore one may conclude that prompting to success does not make us different from AI systems and other fellow humans when it comes to building systems.

To conclude, the idea is to essentially convert the process into what I think is similar to a combination of automating the programming aspect of the project and an ML project pipeline, I will try to articulate the parallels that I see. ML project pipeline goes as follows: given a dataset, firstly we want to do EDA and make sure we understand the dataset and compare it to the task/question we are trying to solve. Next comes Data Engineering, where this could be the initial construction or transformation of the given dataset similarly to what I did with the HWU-64 dataset in the MACalendar project. Once we are satisfied with our dataset, we work on constructing our model which in the MACalendar case is the AI system, once that is done we want to measure and score how well the model does on the dataset, which means defining the right metrics, since for complex systems, accuracy/precision/recall are not informative enough. Since we are discussing ML it is possible we will have to iterate or backtrack on any of the steps multiple times. Not to mention that we want to watch out for overfitting to the dataset while letting our model/system generalize to the problem we are trying to solve. Therefore, combining the workflow with system verification, and iterating over both, is what gives us self-improvement via autonomous programming tools.`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

// Newest first.
export function sortedPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

// "September 4, 2026" — date-only, stable regardless of viewer timezone
// (an ISO YYYY-MM-DD string parses as UTC midnight, so format in UTC too).
export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
