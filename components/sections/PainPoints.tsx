import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PuzzlePieceIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Scattered Notes",
    description: "Your brilliant ideas are lost across Notion, Obsidian, Apple Notes, and random text files.",
    icon: DocumentTextIcon,
  },
  {
    name: "Second Junk Drawer",
    description: "Your 'Second Brain' feels more like a 'Second Junk Drawer'—full of clutter and forgotten gems.",
    icon: PuzzlePieceIcon,
  },
  {
    name: "Search Frustration", 
    description: "You know you wrote it down somewhere, but finding it when you need it most feels impossible.",
    icon: MagnifyingGlassIcon,
  },
  {
    name: "Missing Connections",
    description: "Related ideas remain isolated, preventing the emergence of deeper insights and breakthroughs.",
    icon: LinkIcon,
  },
];

export default function PainPoints() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-blue">
            Does This Sound Familiar?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The endless cycle of digital note-taking
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            You&apos;re not disorganized. You just lack a system. At NotesOrganizer, we believe effective knowledge management isn&apos;t about finding another &quot;perfect&quot; app—it&apos;s about implementing the right framework.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 