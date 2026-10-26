import Image from "next/image";

// TODO: fill in full names and roles
const staff = [
  { name: "Eliot Geer", role: "Managing Editor", photo: "/Eliot.jpeg" },
    { name: "Joanna Beltre", role: "Managing Editor", photo: "/Joanna.jpeg" },
  { name: "Amelia Allen", role: "Marketing Lead", photo: "/Amelia.jpeg" },
  { name: "Andrew Fuente", role: "Outreach Coordinator", photo: "/Andrew.jpeg" },
  { name: "Arian Lagarija", role: "Editing Lead", photo: "/Arian.jpeg" },
  { name: "Grace Gongoleski", role: "Finance and Events Lead", photo: "/Grace.jpeg" },
  { name: "Justin Kuo", role: "Design Lead", photo: "/Justin.jpeg" },
];

export default function About() {
  return (
    <div className="flex flex-col items-center px-6 py-10">
      <span className="text-xs tracking-widest uppercase text-red-600 mb-2">
        About Us
      </span>
      <h2 className="text-3xl font-bold font-serif italic mb-3">
        We are Brown Music Review.
      </h2>

      <div className="w-full max-w-2xl space-y-3">
        <p className="text-[0.984375rem] leading-relaxed text-gray-800 text-center">
          BMR is Brown University&apos;s premier music publication, and simply
          put, we love music. We love listening to it, talking about it, and
          forming strong (but malleable) opinions on it. If that sounds like you,
          write for us!
        </p>
      </div>

      <span className="text-xs tracking-widest uppercase text-red-600 mb-2 mt-12">
        Meet our staff
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-3xl">
        {/* Staff member */}
        <div className="flex flex-col items-center text-center">
          <div className="w-36 h-36 rounded-full overflow-hidden mb-2 border border-gray-200">
            <Image
              src="/Thomas.jpeg"
              alt="Thomas"
              width={144}
              height={144}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="font-semibold text-[1.125rem]">Thomas Lu</p>
          <p className="text-[0.975rem] text-gray-500">Managing Editor</p>
        </div>


        {staff.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center text-center"
          >
            <div className="w-36 h-36 rounded-full overflow-hidden mb-2 border border-gray-200">
              <Image
                src={member.photo}
                alt={member.name}
                width={144}
                height={144}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="font-semibold text-[1.125rem]">{member.name}</p>
            <p className="text-[0.975rem] text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl mt-12">
        <p className="text-sm leading-relaxed text-gray-800 italic">
          The content of all News &amp; Publications groups recognized by USC is
          generated independently from Brown University. The statements, views,
          opinions, and information contained in the publication are personal to
          those of the authors and student group and do not necessarily reflect
          those of Brown University. The publication is not reviewed, approved, or
          endorsed by Brown University or its faculty or staff.
        </p>
      </div>
    </div>
  );
}
