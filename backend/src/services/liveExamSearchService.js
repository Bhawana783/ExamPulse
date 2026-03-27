import Parser from 'rss-parser';

const parser = new Parser({
    timeout: 8000,
    headers: {
        'User-Agent': 'ExamPulse/1.0 (+https://exampulse.local)',
    },
});

const GLOBAL_EXAM_CATALOG = [
    {
        id: 'catalog-upsc-cse',
        examName: 'UPSC Civil Services Examination (CSE)',
        category: 'Competitive',
        level: 'National',
        country: 'India',
        conductingBody: 'Union Public Service Commission',
        eligibility: {
            education: 'Bachelor degree from a recognized university',
            nationality: 'Indian (certain services have broader nationality rules)',
            minAge: 21,
            maxAge: 32,
            otherCriteria: ['Age relaxations for reserved categories as per UPSC rules'],
        },
        syllabus: [
            { section: 'Prelims', topics: ['General Studies', 'CSAT'] },
            { section: 'Mains', topics: ['Essay', 'General Studies I-IV', 'Optional subject papers'] },
            { section: 'Interview', topics: ['Personality test'] },
        ],
        officialLinks: [
            { label: 'Official Website', url: 'https://upsc.gov.in' },
            { label: 'Apply Online', url: 'https://upsconline.nic.in' },
        ],
        registration: {
            officialApplyUrl: 'https://upsconline.nic.in',
        },
        tags: ['upsc', 'ias', 'ips', 'civil services'],
        description: 'India\'s top civil services recruitment examination.',
    },
    {
        id: 'catalog-jee-main',
        examName: 'JEE Main',
        category: 'Competitive',
        level: 'National',
        country: 'India',
        conductingBody: 'National Testing Agency (NTA)',
        eligibility: {
            education: '10+2 with Physics and Mathematics (and one additional subject)',
            nationality: 'Open to Indian and eligible foreign nationals',
            otherCriteria: ['Attempt limits and passing year criteria as per latest NTA notice'],
        },
        syllabus: [
            { section: 'Physics', topics: ['Mechanics', 'Electrodynamics', 'Modern Physics'] },
            { section: 'Chemistry', topics: ['Physical', 'Organic', 'Inorganic'] },
            { section: 'Mathematics', topics: ['Algebra', 'Calculus', 'Coordinate Geometry'] },
        ],
        officialLinks: [
            { label: 'NTA Exams', url: 'https://nta.ac.in' },
            { label: 'JEE Main Portal', url: 'https://jeemain.nta.nic.in' },
        ],
        registration: {
            officialApplyUrl: 'https://jeemain.nta.nic.in',
        },
        tags: ['jee', 'engineering', 'nta'],
        description: 'Entrance exam for NITs, IIITs, and as qualifying route for JEE Advanced.',
    },
    {
        id: 'catalog-neet-ug',
        examName: 'NEET UG',
        category: 'Competitive',
        level: 'National',
        country: 'India',
        conductingBody: 'National Testing Agency (NTA)',
        eligibility: {
            education: '10+2 with Physics, Chemistry, Biology/Biotechnology and English',
            nationality: 'Indian and eligible international categories as per NTA norms',
            minAge: 17,
        },
        syllabus: [
            { section: 'Physics', topics: ['Class XI and XII prescribed units'] },
            { section: 'Chemistry', topics: ['Class XI and XII prescribed units'] },
            { section: 'Biology', topics: ['Botany and Zoology from Class XI and XII'] },
        ],
        officialLinks: [
            { label: 'NTA Exams', url: 'https://nta.ac.in' },
            { label: 'NEET Portal', url: 'https://neet.nta.nic.in' },
        ],
        registration: {
            officialApplyUrl: 'https://neet.nta.nic.in',
        },
        tags: ['neet', 'medical', 'mbbs', 'nta'],
        description: 'Single national medical entrance test for MBBS/BDS and related courses.',
    },
    {
        id: 'catalog-gate',
        examName: 'Graduate Aptitude Test in Engineering (GATE)',
        category: 'Competitive',
        level: 'National',
        country: 'India',
        conductingBody: 'IISc and IITs',
        eligibility: {
            education: 'Undergraduate degree in Engineering/Technology/Architecture/Science',
            nationality: 'Indian and eligible international candidates from approved countries',
        },
        syllabus: [
            { section: 'General Aptitude', topics: ['Verbal ability', 'Numerical ability'] },
            { section: 'Engineering Mathematics', topics: ['Subject-specific mathematics'] },
            { section: 'Core Subject', topics: ['Discipline-specific technical topics'] },
        ],
        officialLinks: [
            { label: 'Official GATE Portal', url: 'https://gate2026.iitr.ac.in' },
        ],
        registration: {
            officialApplyUrl: 'https://gate2026.iitr.ac.in',
        },
        tags: ['gate', 'engineering', 'mtech'],
        description: 'Exam for postgraduate engineering admissions and PSU recruitment.',
    },
    {
        id: 'catalog-cat',
        examName: 'Common Admission Test (CAT)',
        category: 'Competitive',
        level: 'National',
        country: 'India',
        conductingBody: 'Indian Institutes of Management (IIMs)',
        eligibility: {
            education: 'Bachelor degree with minimum marks as per category norms',
            nationality: 'Open to domestic and international applicants',
        },
        syllabus: [
            { section: 'VARC', topics: ['Reading comprehension', 'Verbal reasoning'] },
            { section: 'DILR', topics: ['Data interpretation', 'Logical reasoning'] },
            { section: 'QA', topics: ['Arithmetic', 'Algebra', 'Geometry', 'Modern math'] },
        ],
        officialLinks: [
            { label: 'CAT Official Website', url: 'https://iimcat.ac.in' },
        ],
        registration: {
            officialApplyUrl: 'https://iimcat.ac.in',
        },
        tags: ['cat', 'mba', 'iim'],
        description: 'MBA entrance exam for IIMs and other participating institutes.',
    },
    {
        id: 'catalog-gre',
        examName: 'Graduate Record Examination (GRE)',
        category: 'Professional',
        level: 'International',
        country: 'Global',
        conductingBody: 'ETS',
        eligibility: {
            education: 'Usually bachelor degree aspirants or graduates for higher studies',
            nationality: 'No nationality restriction',
        },
        syllabus: [
            { section: 'Verbal Reasoning', topics: ['Reading comprehension', 'Text completion'] },
            { section: 'Quantitative Reasoning', topics: ['Arithmetic', 'Algebra', 'Data analysis'] },
            { section: 'Analytical Writing', topics: ['Issue task', 'Argument task'] },
        ],
        officialLinks: [
            { label: 'ETS GRE', url: 'https://www.ets.org/gre' },
            { label: 'GRE Registration', url: 'https://ereg.ets.org' },
        ],
        registration: {
            officialApplyUrl: 'https://ereg.ets.org',
        },
        tags: ['gre', 'ets', 'masters', 'abroad'],
        description: 'Graduate admissions exam accepted by universities worldwide.',
    },
    {
        id: 'catalog-gmat',
        examName: 'GMAT Focus Edition',
        category: 'Professional',
        level: 'International',
        country: 'Global',
        conductingBody: 'Graduate Management Admission Council (GMAC)',
        eligibility: {
            education: 'Generally bachelor degree or equivalent',
            nationality: 'No nationality restriction',
        },
        syllabus: [
            { section: 'Quantitative Reasoning', topics: ['Problem solving'] },
            { section: 'Verbal Reasoning', topics: ['Critical reasoning', 'Reading comprehension'] },
            { section: 'Data Insights', topics: ['Data sufficiency', 'Multi-source reasoning'] },
        ],
        officialLinks: [
            { label: 'GMAT Official Website', url: 'https://www.mba.com/exams/gmat-exam' },
        ],
        registration: {
            officialApplyUrl: 'https://www.mba.com/exams/gmat-exam',
        },
        tags: ['gmat', 'mba', 'gmac'],
        description: 'Management admission test accepted by business schools globally.',
    },
    {
        id: 'catalog-sat',
        examName: 'SAT',
        category: 'Certification',
        level: 'International',
        country: 'Global',
        conductingBody: 'College Board',
        eligibility: {
            education: 'Typically high school students applying to undergraduate programs',
            nationality: 'No nationality restriction',
        },
        syllabus: [
            { section: 'Reading and Writing', topics: ['Information and ideas', 'Craft and structure', 'Standard English conventions'] },
            { section: 'Mathematics', topics: ['Algebra', 'Advanced math', 'Problem solving and data analysis', 'Geometry and trigonometry'] },
        ],
        officialLinks: [
            { label: 'College Board SAT', url: 'https://satsuite.collegeboard.org/sat' },
        ],
        registration: {
            officialApplyUrl: 'https://satsuite.collegeboard.org/sat/registration',
        },
        tags: ['sat', 'undergraduate', 'college board'],
        description: 'Standardized undergraduate admissions test used worldwide.',
    },
    {
        id: 'catalog-ielts',
        examName: 'IELTS',
        category: 'Certification',
        level: 'International',
        country: 'Global',
        conductingBody: 'British Council, IDP and Cambridge',
        eligibility: {
            education: 'No formal minimum qualification',
            nationality: 'No nationality restriction',
        },
        syllabus: [
            { section: 'Listening', topics: ['Four recorded monologues and conversations'] },
            { section: 'Reading', topics: ['Academic or General Training passages'] },
            { section: 'Writing', topics: ['Task 1 and Task 2'] },
            { section: 'Speaking', topics: ['Face-to-face interview'] },
        ],
        officialLinks: [
            { label: 'IELTS Official Website', url: 'https://www.ielts.org' },
            { label: 'IDP IELTS', url: 'https://www.ieltsidpindia.com' },
        ],
        registration: {
            officialApplyUrl: 'https://www.ielts.org',
        },
        tags: ['ielts', 'english', 'study abroad'],
        description: 'English language proficiency test for migration, work and education.',
    },
    {
        id: 'catalog-toefl',
        examName: 'TOEFL iBT',
        category: 'Certification',
        level: 'International',
        country: 'Global',
        conductingBody: 'ETS',
        eligibility: {
            education: 'No formal minimum qualification',
            nationality: 'No nationality restriction',
        },
        syllabus: [
            { section: 'Reading', topics: ['Academic reading passages'] },
            { section: 'Listening', topics: ['Lectures and conversations'] },
            { section: 'Speaking', topics: ['Independent and integrated tasks'] },
            { section: 'Writing', topics: ['Integrated and writing for an academic discussion'] },
        ],
        officialLinks: [
            { label: 'ETS TOEFL', url: 'https://www.ets.org/toefl' },
        ],
        registration: {
            officialApplyUrl: 'https://www.ets.org/toefl/test-takers/ibt/register.html',
        },
        tags: ['toefl', 'english', 'ets'],
        description: 'English proficiency exam accepted by universities globally.',
    },
];

const normalizeExam = (exam, sourceType = 'database') => ({
    ...exam,
    sourceType,
    _id: exam._id || null,
    id: exam.id || exam._id || null,
    notificationWindowDays: exam.notificationWindowDays || [30, 7, 1],
    registration: exam.registration || {},
    importantDates: exam.importantDates || {},
    officialLinks: exam.officialLinks || [],
    syllabus: exam.syllabus || [],
    eligibility: exam.eligibility || {},
});

const matchByQuery = (entry, query) => {
    const haystack = [
        entry.examName,
        entry.category,
        entry.level,
        entry.country,
        entry.conductingBody,
        entry.description,
        ...(entry.tags || []),
    ].join(' ').toLowerCase();

    return haystack.includes(query.toLowerCase());
};

const buildGoogleNewsRssUrl = (query) => {
    const search = `${query} exam official notification registration deadline syllabus eligibility`;
    return `https://news.google.com/rss/search?q=${encodeURIComponent(search)}&hl=en-IN&gl=IN&ceid=IN:en`;
};

const fetchLiveUpdates = async (query) => {
    try {
        const feed = await parser.parseURL(buildGoogleNewsRssUrl(query));
        return (feed.items || []).slice(0, 12).map((item) => ({
            title: item.title,
            link: item.link,
            publishedAt: item.pubDate || null,
            source: item.source?.title || 'Live Web',
        }));
    } catch (error) {
        return [];
    }
};

const buildAlerts = (items) => {
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    return items
        .map((item) => {
            const endDate = item.registration?.endDate;
            if (!endDate) {
                return null;
            }
            const daysLeft = Math.ceil((new Date(endDate).getTime() - now.getTime()) / oneDayMs);
            if (daysLeft < 0 || daysLeft > 30) {
                return null;
            }
            return {
                examName: item.examName,
                daysLeft,
                deadline: endDate,
                severity: daysLeft <= 3 ? 'high' : daysLeft <= 7 ? 'medium' : 'low',
                message: `${item.examName} registration closes in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.`,
                officialApplyUrl: item.registration?.officialApplyUrl || item.officialLinks?.[0]?.url || null,
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.daysLeft - b.daysLeft);
};

export const searchLiveExamWorkspace = async ({ query, dbItems = [] }) => {
    const safeQuery = (query || '').trim();
    const normalizedDb = dbItems.map((item) => normalizeExam(item, 'database'));

    if (!safeQuery) {
        return {
            items: normalizedDb,
            updates: [],
            alerts: buildAlerts(normalizedDb),
            meta: {
                mode: 'database-only',
                total: normalizedDb.length,
            },
        };
    }

    const catalogMatches = GLOBAL_EXAM_CATALOG
        .filter((entry) => matchByQuery(entry, safeQuery))
        .map((entry) => normalizeExam(entry, 'global-catalog'));

    const liveUpdates = await fetchLiveUpdates(safeQuery);

    const mergedMap = new Map();
    for (const item of [...catalogMatches, ...normalizedDb]) {
        const key = (item.examName || '').toLowerCase();
        if (!key) {
            continue;
        }
        if (!mergedMap.has(key)) {
            mergedMap.set(key, item);
        } else {
            const current = mergedMap.get(key);
            mergedMap.set(key, {
                ...item,
                ...current,
                officialLinks: current.officialLinks?.length ? current.officialLinks : item.officialLinks,
                syllabus: current.syllabus?.length ? current.syllabus : item.syllabus,
                eligibility: Object.keys(current.eligibility || {}).length ? current.eligibility : item.eligibility,
                sourceType: current.sourceType === 'database' ? 'database' : item.sourceType,
            });
        }
    }

    const items = Array.from(mergedMap.values()).sort((a, b) => a.examName.localeCompare(b.examName));

    return {
        items,
        updates: liveUpdates,
        alerts: buildAlerts(items),
        meta: {
            mode: 'live-workspace',
            total: items.length,
            fromDatabase: normalizedDb.length,
            fromCatalog: catalogMatches.length,
            liveUpdates: liveUpdates.length,
        },
    };
};
