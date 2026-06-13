import { MdOutlineScience } from "react-icons/md";
import { FaFlaskVial } from "react-icons/fa6";
import { TbMicroscopeFilled } from "react-icons/tb";
import { GiGraduateCap } from "react-icons/gi";
import { IoStar } from "react-icons/io5";
import { GiCheckMark } from "react-icons/gi";
import { PiTestTubeDuotone } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa";

const teachingItems = [
    { icon: <MdOutlineScience />, label: 'NEET Faculty' },
    { icon: <FaFlaskVial />, label: 'JEE Faculty' },
    { icon: <TbMicroscopeFilled />, label: 'CSIR NET / JRF / SRF' },
    { icon: <GiGraduateCap />, label: 'GATE Chemistry' },
    { icon: <GiCheckMark />, label: 'CGSET Coaching' },
    { icon: <IoStar />, label: 'DST INSPIRE Mentoring' },
    { icon: <PiTestTubeDuotone />, label: 'Chemical Sciences Research' },
    { icon: <FaBookOpen />, label: 'Published Author' },
]

export default function Teaching() {
    return (
        <section id="teaching">
            <div className="section-inner">
                <div className="section-label">Academic Expertise</div>
                <h2 className="section-title">Teaching &amp; Mentorship</h2>
                <p className="section-sub">Beyond research — guiding students through competitive examinations and shaping the next generation of scientists.</p>
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
