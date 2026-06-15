import { MdOutlineScience } from "react-icons/md";
import { FaFlaskVial } from "react-icons/fa6";
import { TbMicroscopeFilled } from "react-icons/tb";
import { GiGraduateCap } from "react-icons/gi";
import { IoStar } from "react-icons/io5";
import { GiCheckMark } from "react-icons/gi";
import { PiTestTubeDuotone } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa";

const teachingItems = [
    { icon: <MdOutlineScience />, label: 'NEET Mentorship' },
    { icon: <FaFlaskVial />, label: 'JEE Mentorship' },
    { icon: <TbMicroscopeFilled />, label: 'CSIR NET / JRF / SRF' },
    { icon: <GiGraduateCap />, label: 'GATE Chemistry Mentorship' },
    { icon: <GiCheckMark />, label: 'CGSET Mentorship' },
    { icon: <IoStar />, label: 'DST INSPIRE Guidance' },
    { icon: <PiTestTubeDuotone />, label: 'Chemical Sciences Research Guidance' },
    { icon: <FaBookOpen />, label: 'Scientific Author' },
]

export default function Teaching() {
    return (
        <section id="teaching">
            <div className="section-inner">
                <div className="section-label">Academic Expertise</div>
                <h2 className="section-title">Teaching &amp; Mentorship</h2>
                <p className="section-sub">Dedicated to mentoring students, fostering scientific curiosity, and guiding aspirants toward academic and competitive excellence.</p>
                <div className="teach-grid">
                    {teachingItems.map((item, i) => (
                        <div className="teach-pill reveal" key={i}>
                            <span>{item.icon}</span> {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
