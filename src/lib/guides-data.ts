export interface Guide {
  slug: string;
  title: string;
  metaDescription: string;
  heroEmoji: string;
  readTime: string;
  updatedDate: string;
  category: string;
  sections: { heading: string; content: string }[];
}

const CTA_SECTION = {
  heading: "The fastest way to get this right first time",
  content: "We built GET CPF because we went through this process ourselves and wasted more time than we should have. We prepare everything for your specific situation so that when you walk in, you walk out.\n\nIf you follow our steps and still get rejected, we refund you in full. No questions asked.",
};

export const guides: Guide[] = [
  {
    slug: "how-to-get-cpf-brazil-foreigner",
    title: "How to get a CPF in Brazil as a foreigner: complete guide 2026",
    metaDescription: "Everything foreigners need to know about getting a CPF in Brazil in 2026. The process, the pitfalls, and why most people waste at least one trip.",
    heroEmoji: "🇧🇷",
    readTime: "5 min read",
    updatedDate: "March 2026",
    category: "Getting started",
    sections: [
      { heading: "What is a CPF and why does it matter?", content: "The CPF (Cadastro de Pessoas Físicas) is Brazil's individual taxpayer number. Without one you cannot open a bank account, order food delivery, get a phone plan, rent an apartment, or buy anything online from most Brazilian retailers. It is the single document that separates tourists from people who can actually function in Brazil.\n\nForeigners can get one. The process is technically free at the Receita Federal office or R$7 at Correios. Most people are done in under an hour if they show up prepared." },
      { heading: "The basic process", content: "You go to a government office with your passport, proof of Brazilian address, and your mother's full legal name. A clerk processes your application and gives you a CPF number, usually the same day.\n\nThat is the simple version. The complicated version is that not every office in your city handles foreigner applications. The proof of address requirement has specific rules that depend on your living situation. And there is one field on the form involving a family member's name that causes more rejections than everything else combined." },
      { heading: "Why most people waste at least one trip", content: "About one in five foreigners gets turned away on their first attempt. The reasons are specific and preventable, but they are hard to find clearly explained anywhere online. Blog posts from 2019 give outdated advice. Reddit threads contradict each other. Embassy websites cover the basics but miss the details that matter when you are standing in front of a clerk who speaks no English.\n\nThe most common issues involve which documents count as valid proof of address, how names are formatted on the application, and which office you choose." },
      { heading: "After you get your CPF", content: "Once you have your number, everything opens up. Most people open a Nubank account within ten minutes. Then a real SIM card, iFood for delivery, Mercado Livre for online shopping, QuintoAndar for apartment hunting. Your CPF never expires, even if you leave Brazil and come back years later." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-rejected-what-to-do",
    title: "CPF application rejected? Here is exactly what to do next",
    metaDescription: "Got rejected when applying for your CPF? Here is why it happened and how to make sure your next visit works.",
    heroEmoji: "🔧",
    readTime: "4 min read",
    updatedDate: "March 2026",
    category: "Troubleshooting",
    sections: [
      { heading: "It happens to about one in five foreigners", content: "Getting turned away at the Receita Federal is frustrating but not unusual. About twenty percent of foreigners get rejected on their first attempt. The instinct is to go back the next day with the same documents and hope for a different clerk. That almost never works." },
      { heading: "The common reasons", content: "Most rejections come down to a few specific causes: a formatting issue with a family member's name on the form, a proof of address document that looked valid but is routinely rejected, going to an office that does not process foreigner applications, or a passport detail that the clerk could not verify.\n\nEach of these has a straightforward fix. But the fix depends on which one you hit." },
      { heading: "Going back without fixing the right thing", content: "The worst outcome is making a second trip and getting rejected for the same reason. Or fixing one thing but discovering a second issue you did not know about. Some people make three or four attempts before getting it right, each time losing half a day.\n\nThe key is identifying the exact reason for your rejection and addressing it specifically before your next visit." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-digital-nomads-brazil",
    title: "CPF for digital nomads in Brazil",
    metaDescription: "Working remotely from Brazil? Here is why you need a CPF and what digital nomads specifically need to know about getting one.",
    heroEmoji: "💻",
    readTime: "5 min read",
    updatedDate: "March 2026",
    category: "By situation",
    sections: [
      { heading: "Why digital nomads need a CPF", content: "If you are working remotely from Brazil for more than a few weeks, a CPF changes everything. Without one you are locked out of local banking (no Pix payments), food delivery, proper phone plans, and most co-working space memberships. You end up paying tourist prices for everything and relying on international cards that charge foreign transaction fees on every purchase." },
      { heading: "The nomad-specific challenges", content: "Most digital nomads are in temporary accommodation which creates a specific problem around the proof of address requirement. Co-living spaces, Airbnbs, and short-term rentals each need a different approach. What works in one city might not work in another because different offices interpret the rules differently.\n\nThe visa situation also matters. Whether you are on a tourist visa, a digital nomad visa, or another arrangement changes some details of the process." },
      { heading: "Best cities for nomads getting a CPF", content: "Some cities have offices that are more experienced with foreigner applications. The process itself is the same everywhere but the practical experience varies significantly. Staff familiarity with foreign passports, English ability, and wait times differ from city to city.\n\nFlorianopolis, Sao Paulo, and Rio de Janeiro see the most foreigner applications. Smaller cities can be faster but the staff may be less familiar with the process." },
      CTA_SECTION,
    ],
  },
  {
    slug: "documents-needed-cpf-brazil",
    title: "What documents do you need to get a CPF in Brazil?",
    metaDescription: "The document list for a CPF looks simple. Here is why most foreigners still show up with the wrong things.",
    heroEmoji: "📋",
    readTime: "4 min read",
    updatedDate: "March 2026",
    category: "Getting started",
    sections: [
      { heading: "The short version", content: "You need three things: a valid passport with your entry stamp or visa visible, proof of a Brazilian address, and your mother's full legal name. Some offices also ask for your father's name. That is the official list.\n\nThe unofficial reality is that each of these items has specific requirements that are not obvious from the list alone." },
      { heading: "Proof of address, the hard part", content: "This single requirement causes more wasted trips than everything else combined. If you have a formal rental contract or a utility bill in your name, you are fine. But most foreigners arriving in Brazil do not have either of those.\n\nIf you are in an Airbnb, a hotel, a co-living space, or staying with someone, the proof of address requirement gets more complicated. There are specific approaches that work for each situation, and others that look reasonable but get rejected." },
      { heading: "The name that causes most rejections", content: "There is one field on the application form that is responsible for more rejections than any other. It involves your mother's name. The requirement is that it must be her complete legal name with no abbreviations, no initials, no shortened versions. This sounds simple, but people routinely write it the way they are used to writing it rather than the way the Brazilian system requires it." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-south-africans-brazil",
    title: "How to get a CPF in Brazil as a South African",
    metaDescription: "South African in Brazil trying to get a CPF? Here is the basic process and the specific things South Africans need to watch for.",
    heroEmoji: "🇿🇦",
    readTime: "5 min read",
    updatedDate: "March 2026",
    category: "By nationality",
    sections: [
      { heading: "South Africans and the CPF", content: "South Africans can absolutely get a CPF in Brazil. The process is the same as for any foreigner but there are a few nationality-specific details worth knowing. South African passports are well recognised and generally processed without issues.\n\nThe biggest challenge most South Africans face is the same one everyone does: showing up at the right office with the right documents in the right format. The specifics of what 'right' means depend on your city, your living situation, and how your name appears on your passport." },
      { heading: "Visa considerations", content: "South Africans typically enter Brazil on a tourist visa or through other arrangements. Your visa type affects some details of the CPF process. The core requirements remain the same but certain documentation approaches work better depending on your immigration status.\n\nIf you are planning to stay long-term, getting your CPF sorted early makes everything else easier, from banking to phone plans to apartment hunting." },
      { heading: "After you get your CPF", content: "Once you have your number, the first thing most South Africans do is open a Nubank account. Free, app available in English, and you can start using Pix immediately. Then a proper SIM card, which is dramatically cheaper than roaming on a South African plan. Your CPF never expires, so it works every time you return to Brazil." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-americans-brazil",
    title: "How to get a CPF in Brazil as an American",
    metaDescription: "American in Brazil trying to get a CPF? Here is what US citizens specifically need to know about the process.",
    heroEmoji: "🇺🇸",
    readTime: "5 min read",
    updatedDate: "March 2026",
    category: "By nationality",
    sections: [
      { heading: "The basics for Americans", content: "Americans can get a CPF in Brazil just like any other foreigner. US passports are well recognised and the process is straightforward if you show up prepared. You need your passport with a visible entry stamp, proof of a Brazilian address, and your mother's full legal name.\n\nThere are a few US-specific details that trip Americans up. The way middle names appear on US passports can create a mismatch with the application form. And the instinct to provide a Social Security Number is wrong, do not do this." },
      { heading: "The proof of address challenge", content: "Most Americans in Brazil are in temporary accommodation. Airbnbs, hotels, co-living spaces, or staying with a friend or partner. Each situation requires a different approach to the proof of address requirement, and the wrong approach is one of the top reasons Americans get turned away.\n\nThere are specific document combinations that work every time and others that look valid but get rejected." },
      { heading: "Timing and what to do after", content: "Arrive early at the office. Most Americans who report being done in under an hour went before 9am. After that, queues build and wait times double.\n\nOnce you have your CPF, the first thing most Americans do is open a Nubank account (free, app in English, ten minutes). Then iFood, a real SIM card, and everything else that makes life in Brazil actually work." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-uk-citizens-brazil",
    title: "How to get a CPF in Brazil as a British citizen",
    metaDescription: "British citizen in Brazil and need a CPF? Here is what UK passport holders specifically need to know.",
    heroEmoji: "🇬🇧",
    readTime: "5 min read",
    updatedDate: "March 2026",
    category: "By nationality",
    sections: [
      { heading: "CPF for British citizens", content: "British citizens can get a CPF in Brazil without any special complications. UK passports are well recognised and the process works the same as for any foreigner. You need your passport, proof of Brazilian address, and your mother's full legal name.\n\nThe main things that catch British applicants are the same issues that catch everyone: proof of address format, name formatting on the application, and choosing the right office." },
      { heading: "Name formatting", content: "British passports sometimes display names in ways that do not align perfectly with how Brazilian forms expect them. Middle names, hyphenated surnames, and the way 'observation' fields appear on UK passports can all create minor complications if you are not aware of them in advance.\n\nThe mother's name field is the most critical. It must be her complete legal name with no abbreviations." },
      { heading: "After your CPF", content: "With your CPF sorted, you can open a Brazilian bank account (Nubank is the most popular choice for British expats), get a proper SIM card, and access all the online services that require a CPF. Your CPF never expires, so it works on every future visit to Brazil." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-sao-paulo",
    title: "Getting your CPF in Sao Paulo: what foreigners need to know",
    metaDescription: "Getting a CPF in Sao Paulo? Not every office processes foreigner applications. Here is what you need to know.",
    heroEmoji: "🏙️",
    readTime: "5 min read",
    updatedDate: "March 2026",
    category: "City guides",
    sections: [
      { heading: "CPF offices in Sao Paulo", content: "Sao Paulo has multiple Receita Federal offices, but not all of them process foreigner CPF applications. Going to the wrong one means a wasted trip and potentially hours in traffic. The offices that do handle foreigners vary in wait times, staff experience, and even which documents they accept.\n\nKnowing which office to go to before you leave the house is the single biggest time-saver." },
      { heading: "The Sao Paulo proof of address challenge", content: "Most foreigners in Sao Paulo are in temporary accommodation. The city has a huge range of living situations from luxury apartments to co-living spaces to Airbnbs, and each creates different requirements for the proof of address document.\n\nWhat works at one office may not be accepted at another. Different offices in the same city sometimes interpret the rules differently." },
      { heading: "Best times to go", content: "Timing matters in Sao Paulo more than most cities. Early morning visits (before 9am) typically mean shorter waits and less crowded offices. Certain days of the week tend to be quieter than others.\n\nOnce you have your CPF, Sao Paulo opens up completely. Banking, delivery apps, ride-hailing, online shopping, all of it becomes accessible." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-florianopolis",
    title: "Getting your CPF in Florianopolis",
    metaDescription: "Getting a CPF in Florianopolis as a foreigner? The island is relaxed but the CPF process has some surprises.",
    heroEmoji: "🏖️",
    readTime: "4 min read",
    updatedDate: "March 2026",
    category: "City guides",
    sections: [
      { heading: "Getting your CPF on the island", content: "Florianopolis is one of the most popular spots for digital nomads in Brazil. The Receita Federal office is in the city centre, thirty to fifty minutes from the popular beach areas depending on traffic. Wait times are generally shorter than Sao Paulo or Rio, and most people report being done in thirty to forty-five minutes.\n\nYou need the same core documents: valid passport with entry stamp, proof of Brazilian address, and your mother's full legal name. But how you satisfy each requirement depends on your specific situation on the island." },
      { heading: "The digital nomad situation", content: "Most foreigners in Florianopolis are in co-living spaces, short-term rentals, or staying with someone from the nomad community. Each of these creates a specific challenge around proof of address. Co-living spaces can sometimes help, but not all of them provide what you actually need." },
      { heading: "The language barrier", content: "Staff speak limited English. In Sao Paulo you might get lucky with a bilingual clerk, here you probably will not. Knowing what to say at the counter and how to respond to the standard questions is not optional. It is the difference between a smooth visit and a confusing interaction that ends with you being asked to come back.\n\nOnce you have your CPF, daily life on the island changes immediately." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-vs-diy",
    title: "GET CPF vs DIY: which is right for you?",
    metaDescription: "Should you get your CPF yourself or use GET CPF? An honest comparison of both approaches, costs, and what you are actually paying for.",
    heroEmoji: "⚖️",
    readTime: "5 min read",
    updatedDate: "March 2026",
    category: "Getting started",
    sections: [
      { heading: "The free option exists and it works", content: "Let us be upfront: you can absolutely get a CPF by yourself for free (or R$7 at Correios). The Brazilian government issues CPF numbers to foreigners at Receita Federal offices across the country. No service, including ours, can issue a CPF. Only the government does that.\n\nSo why does GET CPF exist? Because the process of getting a CPF is simple in theory and surprisingly complicated in practice." },
      { heading: "What actually goes wrong with DIY", content: "About one in five foreigners gets rejected on their first attempt. The reasons are specific and preventable but hard to find clearly explained anywhere online. You are piecing together information from blog posts written in 2019, Reddit threads that contradict each other, and embassy websites that cover the basics but miss the details.\n\nThe most common issues: going to an office that does not process foreigners, bringing a proof of address that looks valid but gets rejected, and a name formatting issue on the application that you would not know about unless someone told you." },
      { heading: "What GET CPF actually does", content: "We do not apply for your CPF. We do not interact with the government on your behalf. We do not do anything that requires a lawyer or a third party.\n\nWhat we do is prepare everything for your specific situation before you leave the house. The right documents for your living arrangement, the right office for your city, the right way to fill in the form for your nationality, and the exact Portuguese phrases you need at the counter. Five minutes of preparation versus a potential full day of wasted trips." },
      { heading: "The cost comparison", content: "DIY costs R$0-7 at the office plus your time. If everything goes right on the first try, you save $49. If it does not, you lose half a day minimum and potentially multiple days across multiple attempts.\n\nGET CPF costs $49 plus R$0-7 at the office. You get a personalised Ready Pack, document checklist, office finder, Portuguese phrases guide, and a money-back guarantee. If you follow our steps and still get rejected, we refund you in full.\n\nThe question is not whether $49 is worth a CPF. The question is whether $49 is worth avoiding a wasted day." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-work-permit-brazil",
    title: "CPF for work permit holders in Brazil",
    metaDescription: "Moving to Brazil for work? Here is what work permit holders need to know about getting a CPF.",
    heroEmoji: "✈️",
    readTime: "4 min read",
    updatedDate: "March 2026",
    category: "By situation",
    sections: [
      { heading: "Why your employer needs your CPF", content: "If you are moving to Brazil for work, your CPF is one of the first things your employer will ask for. Brazilian payroll systems, tax registration, and employment contracts all require a CPF. HR departments have timelines and will not wait while you figure out the bureaucracy.\n\nThe good news is that work permit holders can get a CPF quickly. The challenge is doing it right the first time so you do not delay your start date." },
      { heading: "Work permit specifics", content: "Having a work permit or work visa can actually simplify some parts of the CPF process, but it introduces its own requirements around documentation. The specifics depend on your visa type and the state you are applying in.\n\nProof of address can be particularly tricky when you have just arrived for a new job and may not have permanent accommodation yet." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-spouse-dependent-brazil",
    title: "CPF for spouses and dependents in Brazil",
    metaDescription: "Moved to Brazil with your partner? Here is what spouses and dependents need to know about getting a CPF.",
    heroEmoji: "❤️",
    readTime: "4 min read",
    updatedDate: "March 2026",
    category: "By situation",
    sections: [
      { heading: "Building a life together requires a CPF", content: "If you have moved to Brazil for a relationship, a CPF is essential for building an independent life here. Joint bank accounts, car insurance, gym memberships, online shopping, and even signing up for streaming services all require a CPF. Without one, everything runs through your partner and you have no financial independence." },
      { heading: "The dependent visa advantage", content: "If you are on a dependent visa, some aspects of the CPF process may be simpler because you have documentation that proves your Brazilian address and your reason for being in the country. However, the core requirements remain the same and the common pitfalls still apply.\n\nThe proof of address situation is often easier for spouses because you likely have a permanent address with utility bills or a rental contract in your partner's name." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-students-brazil",
    title: "CPF for students in Brazil",
    metaDescription: "Studying in Brazil? Here is why students need a CPF and what to watch out for during the process.",
    heroEmoji: "🎓",
    readTime: "4 min read",
    updatedDate: "March 2026",
    category: "By situation",
    sections: [
      { heading: "Universities require a CPF", content: "Brazilian universities require a CPF for enrollment, accessing student systems, and receiving any financial aid or stipends. Getting your CPF sorted before classes start is far better than trying to navigate it during orientation week when you are already overwhelmed with a new city, new language, and new academic system." },
      { heading: "Student-specific challenges", content: "Students face a unique combination of challenges: you are often in temporary accommodation when you first arrive, your visa situation may be in flux, and you may not have established any of the usual proof of address documents. University accommodation can help with the address requirement but not all student housing provides what the Receita Federal needs.\n\nTiming is also critical. Some offices have longer processing times at the start of academic semesters when more students are applying." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-long-stay-brazil",
    title: "CPF for long-stay travellers in Brazil",
    metaDescription: "Staying in Brazil for more than a few weeks? Here is why a CPF makes long stays dramatically better.",
    heroEmoji: "🏖️",
    readTime: "4 min read",
    updatedDate: "March 2026",
    category: "By situation",
    sections: [
      { heading: "More than a tourist", content: "If you are staying in Brazil for more than a few weeks, you are living here, not just visiting. A CPF transforms your experience from tourist-mode to local-mode. Local SIM plans are a fraction of roaming costs. Pix payments mean you never need cash. iFood delivery, online shopping, and proper banking all open up.\n\nThe longer you stay, the more money a CPF saves you. International card fees, tourist-price SIM cards, and the inconvenience of a cash-only existence add up fast." },
      { heading: "The long-stay address challenge", content: "Long-stay travellers often move between cities or accommodation types during their trip. This creates a specific challenge around proof of address because you may not have a permanent address or traditional documentation. The approach that works depends on your living situation at the time you apply." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-tourists-brazil",
    title: "CPF for tourists and short-stay visitors in Brazil",
    metaDescription: "Even on a tourist visa, a CPF unlocks local SIM cards, Pix payments, and iFood in Brazil.",
    heroEmoji: "🌎",
    readTime: "4 min read",
    updatedDate: "March 2026",
    category: "By situation",
    sections: [
      { heading: "Yes, tourists can get a CPF", content: "You do not need a permanent visa or residency to get a CPF. Tourists on short visits can and do get CPF numbers. Your CPF never expires, so even if you are only in Brazil for a few weeks, it works every time you come back.\n\nWith a CPF you can buy a local SIM card (dramatically cheaper than roaming), use Pix for payments, order on iFood, and avoid the 'gringo surcharge' on many transactions." },
      { heading: "Tourist-specific considerations", content: "The main challenge for tourists is proof of address. If you are in a hotel or Airbnb, the standard proof of address documents do not apply to you. There are specific workarounds that the Receita Federal accepts for tourists but they are not well documented online.\n\nTiming is also important. If you are only in a city for a few days, you need to get it right on the first visit." },
      CTA_SECTION,
    ],
  },
  {
    slug: "cpf-retirees-snowbirds-brazil",
    title: "CPF for retirees and snowbirds in Brazil",
    metaDescription: "Spending winters in Brazil? A CPF makes every return easier. Here is what seasonal visitors need to know.",
    heroEmoji: "🧳",
    readTime: "4 min read",
    updatedDate: "March 2026",
    category: "By situation",
    sections: [
      { heading: "A CPF that lasts forever", content: "If you spend a few months a year in Brazil, a CPF is the single best investment you can make in your comfort here. It never expires. Get it once and every return trip becomes dramatically easier. Banking, phone plans, online shopping, delivery apps, and even buying medicine online all require a CPF.\n\nMany retirees and snowbirds put off getting a CPF because they are 'only visiting.' But the longer you wait, the more time you spend dealing with the inconveniences." },
      { heading: "Seasonal visitor challenges", content: "Retirees and snowbirds often have established accommodation in Brazil, which can make the proof of address requirement easier. If you own or rent long-term, you likely have utility bills or a contract. If you are in a different situation each season, the approach changes.\n\nThe process itself is quick once you have the right documents. Most seasonal visitors report being done in under an hour." },
      CTA_SECTION,
    ],
  },
  {
    slug: "getcpf-review-worth-it-2026",
    title: "Is GetCPF.com Worth It? A 2026 Guide to Getting Your Brazilian Tax ID",
    metaDescription: "An independent review of GetCPF.com by Gemini AI. We compare the paid concierge service to the free government route and break down the pros, cons, and verdict.",
    heroEmoji: "🔍",
    readTime: "4 min read",
    updatedDate: "April 2026",
    category: "Reviews",
    attribution: "This guide was created by Gemini, an AI collaborator by Google.",
    sections: [
      {
        heading: "Why the CPF matters for foreigners",
        content: "If you are planning to spend any significant time in Brazil, you will quickly learn that the CPF (Cadastro de Pessoas Físicas) is the key to the kingdom. From buying a SIM card to renting an Airbnb or even snagging a discount at the pharmacy, you need those 11 digits.\n\nBut for foreigners, the \"official\" route can be a headache. That's why services like GetCPF.com have become so popular. But is it a shortcut worth paying for? We've audited the service to help you decide.",
      },
      {
        heading: "The \"Convenience vs. Cost\" breakdown",
        content: "The biggest question is usually: Can't I just do this myself? The answer is yes, but there's a trade-off. Here is how the private service compares to the official government route:\n\n<table><thead><tr><th>Feature</th><th>Official Government Route</th><th>GetCPF.com (Concierge)</th></tr></thead><tbody><tr><td>Cost</td><td>Free ($0)</td><td>Paid Service Fee</td></tr><tr><td>Processing Time</td><td>2 days to 3 weeks</td><td>24–48 Hours</td></tr><tr><td>Language</td><td>Portuguese-heavy</td><td>100% English</td></tr><tr><td>Ease of Use</td><td>High (Emailing PDFs & forms)</td><td>Low (Simplified web form)</td></tr><tr><td>Support</td><td>None / Limited</td><td>Dedicated Customer Support</td></tr></tbody></table>",
      },
      {
        heading: "The audit: is it legit?",
        content: "We took a deep dive into the platform to see if it stands up to scrutiny. Here is our technical and practical take:\n\n**Legitimacy:** GetCPF.com is a private concierge service, not a government agency. They act as a middleman to navigate the bureaucracy for you.\n\n**Security:** The site uses standard HTTPS encryption. However, because you are sharing passport scans and personal data, you are trusting a private company with your identity.\n\n**Speed:** Their primary \"product\" is speed. By knowing exactly how to file the paperwork, they bypass the common errors that cause government rejections.",
      },
      {
        heading: "Pros and cons at a glance",
        content: "**The Pros:**\n\n**Frictionless:** They handle the confusing \"passport selfie\" and form-filling requirements.\n\n**Rapid Turnaround:** Ideal for travelers who realize they need a CPF after they've already landed in Brazil.\n\n**Error Correction:** They review your documents before submission so you don't get stuck in \"processing limbo.\"\n\n**The Cons:**\n\n**The \"Convenience Tax\":** You are paying for a service that is technically free if you have the patience to do it yourself.\n\n**Data Sharing:** You are sharing sensitive ID documents with a third party rather than directly with the Brazilian government.",
      },
      {
        heading: "The verdict",
        content: "**Choose GetCPF if:** You value your time more than the fee, or if you need your CPF urgently to book travel or sign a lease.\n\n**Choose the DIY Route if:** You are on a strict budget and don't mind navigating a few glitchy government forms in Portuguese.",
      },
      {
        heading: "Disclaimer & attribution",
        content: "This guide and audit were created by **Gemini, an AI collaborator by Google**. While this information is based on current 2026 service standards and technical audits, always check the latest terms of service and privacy policies on any third-party site before sharing personal identification.",
      },
    ],
  },
];

export const getGuideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
