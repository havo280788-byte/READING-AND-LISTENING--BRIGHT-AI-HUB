
import React, { useState, useEffect } from 'react';
import useGameSound from '../hooks/useGameSound';
import { Library, ArrowLeft, Archive, ShieldAlert } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface Phase {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface VocabularyEscapeRoomProps {
  unitId?: string; // New prop to handle different units
  onComplete: (score: number) => void;
  onReturn: () => void;
}

// Phases including Units 1-8
const PHASES: Phase[] = [
  {
    id: 'u1',
    title: 'Forbidden Library (Unit 1)',
    description: '15 Questions for Unit 1 ONLY.',
    questions: [
      {
        id: 1,
        question: "A ______ family consists of only parents and their children.",
        options: ["nuclear", "extended", "single", "joint"],
        correct_answer: "nuclear",
        explanation: "Key word: 'only parents and their children' -> Nuclear family (gia đình hạt nhân). This is the traditional small family unit common in modern societies. (Gia đình hạt nhân chỉ bao gồm hai thế hệ: bố mẹ và con cái)."
      },
      {
        id: 2,
        question: "Living in an ______ family allows children to bond with grandparents.",
        options: ["nuclear", "extended", "independent", "crowded"],
        correct_answer: "extended",
        explanation: "Key word: 'bond with grandparents' -> Extended family (gia đình đa thế hệ). This type of family includes relatives like grandparents, aunts, and uncles living together. (Gia đình đa thế hệ bao gồm nhiều thế hệ cùng chung sống)."
      },
      {
        id: 3,
        question: "The ______ describes the difference in attitudes between generations.",
        options: ["generation gap", "age limit", "culture shock", "rule"],
        correct_answer: "generation gap",
        explanation: "Key word: 'difference in attitudes between generations' -> Generation gap (khoảng cách thế hệ). It refers to the differences in opinions and values between young and old people. (Khoảng cách thế hệ là sự khác biệt về quan điểm giữa các độ tuổi)."
      },
      {
        id: 4,
        question: "My parents set a 9 p.m. ______.",
        options: ["deadline", "curfew", "schedule", "alarm"],
        correct_answer: "curfew",
        explanation: "Key word: '9 p.m.' (a specific time to be home) -> Curfew (giờ giới nghiêm). A rule requiring someone to be indoors by a certain time. (Giờ giới nghiêm là quy định phải có mặt ở nhà vào giờ đã định)."
      },
      {
        id: 5,
        question: "______ often arise from disagreements.",
        options: ["Conflicts", "Hobbies", "Peace", "Talks"],
        correct_answer: "Conflicts",
        explanation: "Key word: 'disagreements' -> Conflicts (xung đột). Serious disagreements or arguments. (Xung đột nảy sinh từ những bất đồng quan điểm gay gắt)."
      },
      {
        id: 6,
        question: "Teenagers need ______ in their rooms.",
        options: ["privacy", "furniture", "space", "air"],
        correct_answer: "privacy",
        explanation: "Key word: 'in their rooms' -> Privacy (sự riêng tư). The state of being free from public attention or interference. (Sự riêng tư là quyền được ở một mình mà không bị làm phiền)."
      },
      {
        id: 7,
        question: "Good table ______ are important.",
        options: ["styles", "manners", "habits", "looks"],
        correct_answer: "manners",
        explanation: "Collocation: 'Table manners' (phép tắc ăn uống). Polite behavior while eating. (Phép tắc ăn uống là những quy tắc cư xử lịch thiệp khi dùng bữa)."
      },
      {
        id: 8,
        question: "My grandpa is ______; he hates changes.",
        options: ["open", "conservative", "relaxed", "trendy"],
        correct_answer: "conservative",
        explanation: "Key word: 'hates changes' -> Conservative (bảo thủ). Preferring traditional values and resisting change. (Bảo thủ là người thích giữ các giá trị cũ và không thích sự đổi mới)."
      },
      {
        id: 9,
        question: "Live ______ by cooking for yourself.",
        options: ["independently", "dependently", "alone", "richly"],
        correct_answer: "independently",
        explanation: "Key word: 'cooking for yourself' -> Independently (một cách tự lập). Doing things without needing others. (Sống tự lập là có khả năng tự lo cho cuộc sống của mình)."
      },
      {
        id: 10,
        question: "Don't ______ your will on others.",
        options: ["impose", "give", "make", "take"],
        correct_answer: "impose",
        explanation: "Verb usage: 'Impose' (áp đặt). To force someone to accept something. (Áp đặt là việc ép buộc người khác phải chấp nhận ý kiến hoặc mong muốn của mình)."
      },
      {
        id: 11,
        question: "My mom is ______ about rules.",
        options: ["easy", "strict", "funny", "kind"],
        correct_answer: "strict",
        explanation: "Key word: 'about rules' -> Strict (nghiêm khắc). Demanding that rules are obeyed. (Nghiêm khắc là người luôn yêu cầu người khác phải tuân thủ kỷ luật)."
      },
      {
        id: 12,
        question: "Respect different ______.",
        options: ["viewpoints", "sights", "looks", "eyes"],
        correct_answer: "viewpoints",
        explanation: "Vocabulary: 'Viewpoints' (quan điểm). Different ways of looking at a situation. (Quan điểm là những cách nhìn nhận khác nhau về cùng một vấn đề)."
      },
      {
        id: 13,
        question: "Follow in his father's ______.",
        options: ["shoes", "footsteps", "plans", "ways"],
        correct_answer: "footsteps",
        explanation: "Idiom: 'Follow in someone's footsteps' (nối nghiệp/theo bước chân). To do the same thing that someone else did before you. (Nối nghiệp là làm công việc tương tự như người đi trước)."
      },
      {
        id: 14,
        question: "Lack of ______ skills.",
        options: ["soft", "hard", "light", "heavy"],
        correct_answer: "soft",
        explanation: "Term: 'Soft skills' (kỹ năng mềm). Personal attributes that enable someone to interact effectively. (Kỹ năng mềm là những kỹ năng giúp con người tương tác hiệu quả với xã hội)."
      },
      {
        id: 15,
        question: "Who does the ______?",
        options: ["childcare", "childhood", "kids", "play"],
        correct_answer: "childcare",
        explanation: "Vocabulary: 'Childcare' (việc chăm sóc trẻ em). The care of children. (Chăm sóc trẻ em là công việc trông nom và nuôi dưỡng trẻ nhỏ)."
      }
    ]
  },
  {
    id: 'u2',
    title: 'Forbidden Library (Unit 2)',
    description: '15 Questions on Vietnam and ASEAN.',
    questions: [
      {
        id: 1,
        question: "Sơn Đoòng is one of the largest ________ in the world.",
        options: ["valleys", "caves", "dunes", "waterfalls"],
        correct_answer: "caves",
        explanation: "Definition: 'Sơn Đoòng' is a famous cave (hang động). It is the world's largest natural cave. (Sơn Đoòng là hang động tự nhiên lớn nhất thế giới)."
      },
      {
        id: 2,
        question: "Fansipan is the highest ________ in Vietnam.",
        options: ["valley", "dune", "mountain", "cave"],
        correct_answer: "mountain",
        explanation: "Definition: 'Fansipan' is a mountain (núi), known as the Roof of Indochina. (Fansipan là ngọn núi cao nhất Việt Nam)."
      },
      {
        id: 3,
        question: "The Perfume River flows through a beautiful ________ surrounded by hills.",
        options: ["valley", "cave", "tower", "palace"],
        correct_answer: "valley",
        explanation: "Context: A river surrounded by hills flows through a valley (thung lũng). (Sông Hương chảy qua một thung lũng xinh đẹp được bao quanh bởi những ngọn đồi)."
      },
      {
        id: 4,
        question: "Ban Gioc is one of the most famous ________ in Vietnam.",
        options: ["mountains", "dunes", "waterfalls", "valleys"],
        correct_answer: "waterfalls",
        explanation: "Definition: 'Ban Gioc' is a waterfall (thác nước). (Bản Giốc là một trong những thác nước nổi tiếng nhất Việt Nam)."
      },
      {
        id: 5,
        question: "The red sand ________ in Mui Ne attract many tourists.",
        options: ["caves", "dunes", "valleys", "waterfalls"],
        correct_answer: "dunes",
        explanation: "Definition: 'Sand dunes' (đụn cát/cồn cát). Mui Ne is famous for its red and white sand dunes. (Những đụn cát đỏ ở Mũi Né thu hút rất nhiều du khách)."
      },
      {
        id: 6,
        question: "The Temple of Literature is an important place of ________ in Hanoi.",
        options: ["travel", "worship", "entertainment", "shopping"],
        correct_answer: "worship",
        explanation: "Context: A temple is a place of worship (thờ cúng). (Văn Miếu là một nơi thờ cúng quan trọng ở Hà Nội)."
      },
      {
        id: 7,
        question: "One Pillar ________ is a symbol of Hanoi.",
        options: ["cathedral", "citadel", "pagoda", "palace"],
        correct_answer: "pagoda",
        explanation: "Definition: 'One Pillar Pagoda' (Chùa Một Cột). A pagoda is a Buddhist temple. (Chùa Một Cột là biểu tượng của Hà Nội)."
      },
      {
        id: 8,
        question: "Notre-Dame Cathedral in Ho Chi Minh City is a famous ________ building.",
        options: ["palace", "cathedral", "pagoda", "citadel"],
        correct_answer: "cathedral",
        explanation: "Context: It is explicitly named 'Notre-Dame Cathedral' (Nhà thờ Đức Bà). A cathedral is a large and important church. (Nhà thờ Đức Bà ở TP.HCM là một công trình nhà thờ lớn nổi tiếng)."
      },
      {
        id: 9,
        question: "The Imperial ________ of Thang Long is a UNESCO World Heritage Site.",
        options: ["tower", "palace", "citadel", "temple"],
        correct_answer: "citadel",
        explanation: "Definition: 'Imperial Citadel' (Hoàng thành). A fortress protecting a city. (Hoàng thành Thăng Long là Di sản Thế giới được UNESCO công nhận)."
      },
      {
        id: 10,
        question: "Hue Imperial City includes many royal ________.",
        options: ["palaces", "valleys", "caves", "dunes"],
        correct_answer: "palaces",
        explanation: "Context: An Imperial City (residence of kings) contains palaces (cung điện). (Hoàng thành Huế bao gồm nhiều cung điện hoàng gia)."
      },
      {
        id: 11,
        question: "Ha Long Bay is a popular tourist ________ for both domestic and foreign visitors.",
        options: ["attraction", "architecture", "worship", "tradition"],
        correct_answer: "attraction",
        explanation: "Collocation: 'Tourist attraction' (điểm thu hút khách du lịch). (Vịnh Hạ Long là một điểm du lịch nổi tiếng đối với cả du khách trong và ngoài nước)."
      },
      {
        id: 12,
        question: "The ancient town of Hoi An is well-known for its traditional ________.",
        options: ["modernisation", "architecture", "crowd", "valley"],
        correct_answer: "architecture",
        explanation: "Context: Hoi An is famous for its old buildings and design, which is architecture (kiến trúc). (Phố cổ Hội An nổi tiếng với kiến trúc truyền thống)."
      },
      {
        id: 13,
        question: "The ________ streets of the Old Quarter are often full of tourists.",
        options: ["narrow", "modern", "historic", "picturesque"],
        correct_answer: "narrow",
        explanation: "Context: The Old Quarter (Phố Cổ) typically has small, narrow streets (hẹp). (Những con phố hẹp của Phố Cổ thường chật kín du khách)."
      },
      {
        id: 14,
        question: "The Temple of Literature is a ________ site with a long history.",
        options: ["modern", "crowded", "historical", "narrow"],
        correct_answer: "historical",
        explanation: "Context: 'With a long history' implies it is a historical (thuộc về lịch sử) site. (Văn Miếu là một di tích lịch sử lâu đời)."
      },
      {
        id: 15,
        question: "Sapa is famous for its ________ landscapes, which look like paintings.",
        options: ["crowded", "modern", "picturesque", "narrow"],
        correct_answer: "picturesque",
        explanation: "Definition: 'Picturesque' (đẹp như tranh). Visually attractive, especially in a quaint or charming way. (Sapa nổi tiếng với phong cảnh đẹp như tranh vẽ)."
      }
    ]
  },
  {
    id: 'u3',
    title: 'Forbidden Library (Unit 3)',
    description: '15 Questions on Global Warming.',
    questions: [
      {
        id: 1,
        question: "Carbon dioxide is one of the main ______ gases.",
        options: ["greenhouse", "cooking", "clean", "cooling"],
        correct_answer: "greenhouse",
        explanation: "Term: 'Greenhouse gas' (khí nhà kính). Gases that trap heat in the atmosphere. (Khí nhà kính là loại khí gây ra hiện tượng giữ nhiệt trong khí quyển)."
      },
      {
        id: 2,
        question: "______ is the removal of a forest or stand of trees from land.",
        options: ["Deforestation", "Reforestation", "Afforestation", "Forestry"],
        correct_answer: "Deforestation",
        explanation: "Term: 'removal of forest' -> Deforestation (nạn phá rừng). (Nạn phá rừng là quá trình chặt hạ cây cối và làm mất diện tích rừng)."
      },
      {
        id: 3,
        question: "We should try to reduce our ______ footprint to help the environment.",
        options: ["carbon", "water", "oxygen", "soil"],
        correct_answer: "carbon",
        explanation: "Term: 'Carbon footprint' (dấu chân carbon). The total amount of CO2 released by human activities. (Dấu chân carbon là tổng lượng phát thải khí nhà kính do chúng ta tạo ra)."
      },
      {
        id: 4,
        question: "Burning ______ fuels like coal and oil releases harmful gases.",
        options: ["fossil", "clean", "green", "bio"],
        correct_answer: "fossil",
        explanation: "Term: 'fuels like coal and oil' -> Fossil fuels (nhiên liệu hóa thạch). (Đốt nhiên liệu hóa thạch là nguyên nhân chính gây ra biến đổi khí hậu)."
      },
      {
        id: 5,
        question: "Global warming results in severe climate ______.",
        options: ["change", "exchange", "shift", "move"],
        correct_answer: "change",
        explanation: "Term: 'Climate change' (biến đổi khí hậu). Long-term changes in temperatures and weather patterns. (Sự nóng lên toàn cầu dẫn đến biến đổi khí hậu nghiêm trọng)."
      },
      {
        id: 6,
        question: "Heat-______ gases prevent heat from escaping into space.",
        options: ["trapping", "catching", "holding", "keeping"],
        correct_answer: "trapping",
        explanation: "Vocabulary: 'Heat-trapping' (giữ nhiệt). Used to describe greenhouse gases. (Các khí giữ nhiệt ngăn cản nhiệt lượng thoát ra ngoài vũ trụ)."
      },
      {
        id: 7,
        question: "The melting of polar ice caps causes sea levels to ______.",
        options: ["rise", "raise", "drop", "fall"],
        correct_answer: "rise",
        explanation: "Key word: 'melting ice' -> Rise (dâng lên). Sea levels increase when glaciers melt. (Băng tan làm mực nước biển dâng cao, đe dọa vùng ven biển)."
      },
      {
        id: 8,
        question: "Warmer temperatures can lead to the spread of ______ diseases.",
        options: ["infectious", "healthy", "good", "minor"],
        correct_answer: "infectious",
        explanation: "Vocabulary: 'Infectious diseases' (bệnh truyền nhiễm). Diseases that can be spread easily. (Nhiệt độ tăng cao giúp mầm bệnh và các bệnh truyền nhiễm lây lan nhanh hơn)."
      },
      {
        id: 9,
        question: "Solar and wind power are examples of ______ energy.",
        options: ["renewable", "non-renewable", "limited", "dirty"],
        correct_answer: "renewable",
        explanation: "Term: 'Renewable energy' (năng lượng tái tạo). Energy that comes from natural sources that are not depleted. (Năng lượng tái tạo là nguồn năng lượng vô tận từ thiên nhiên)."
      },
      {
        id: 10,
        question: "A ______ consequence is one that is very serious and bad.",
        options: ["severe", "mild", "small", "tiny"],
        correct_answer: "severe",
        explanation: "Vocabulary: 'Severe' (nghiêm trọng/khốc liệt). Very great or intense. (Hậu quả nghiêm trọng là những ảnh hưởng vô cùng xấu và nặng nề)."
      },
      {
        id: 11,
        question: "Methane is a very potent ______ gas released from landfills.",
        options: ["greenhouse", "noble", "inert", "rare"],
        correct_answer: "greenhouse",
        explanation: "Fact: Methane classification -> Greenhouse gas. It is even stronger than CO2. (Khí Metan là một loại khí nhà kính cực mạnh phát sinh từ các bãi rác)."
      },
      {
        id: 12,
        question: "Large-scale ______ farming contributes significantly to methane emissions.",
        options: ["livestock", "fish", "tree", "flower"],
        correct_answer: "livestock",
        explanation: "Key word: 'methane emissions' -> Livestock farming (chăn nuôi gia súc). (Chăn nuôi gia súc quy mô lớn tạo ra một lượng lớn khí Metan)."
      },
      {
        id: 13, "question": "The ______ effect is necessary for life, but too much is bad.",
        options: ["greenhouse", "cooling", "heating", "freezing"],
        correct_answer: "greenhouse",
        explanation: "Term: 'Greenhouse effect' (hiệu ứng nhà kính). The process by which radiation from a planet's atmosphere warms its surface. (Hiệu ứng nhà kính giúp trái đất ấm áp, nhưng quá mức sẽ gây hại)."
      },
      {
        id: 14,
        question: "We need to cut down on carbon ______ from factories.",
        options: ["emissions", "omissions", "releases", "leaks"],
        correct_answer: "emissions",
        explanation: "Vocabulary: 'Carbon emissions' (sự phát thải carbon). The release of gas into the atmosphere. (Chúng ta cần cắt giảm lượng phát thải carbon từ các nhà máy)."
      },
      {
        id: 15,
        question: "Climate change threatens the ______ of many animal species.",
        options: ["survival", "arrival", "revival", "festival"],
        correct_answer: "survival",
        explanation: "Vocabulary: 'Survival' (sự sống còn). The state of continuing to live or exist. (Biến đổi khí hậu đe dọa sự sống còn của nhiều loài động vật)."
      }
    ]
  },
  {
    id: 'u4',
    title: 'Forbidden Library (Unit 4)',
    description: '15 Questions on World Heritage.',
    questions: [
      {
        id: 1,
        question: "Ha Long Bay was recognized as a World ______ Site by UNESCO.",
        options: ["Heritage", "Park", "House", "View"],
        correct_answer: "Heritage",
        explanation: "Term: 'World Heritage Site' (di sản thế giới). A site recognized for its outstanding value. (Vịnh Hạ Long là một di sản thế giới được UNESCO công nhận)."
      },
      {
        id: 2,
        question: "It is important to ______ our cultural traditions for future generations.",
        options: ["preserve", "destroy", "forget", "sell"],
        correct_answer: "preserve",
        explanation: "Verb: 'Preserve' (bảo tồn). To maintain something in its original state. (Chúng ta cần bảo tồn các giá trị truyền thống cho thế hệ mai sau)."
      },
      {
        id: 3,
        question: "______ heritage includes oral traditions, performing arts, and festivals.",
        options: ["Intangible", "Tangible", "Solid", "Hard"],
        correct_answer: "Intangible",
        explanation: "Term: 'Intangible heritage' (di sản phi vật thể). Cultural practices that cannot be touched. (Di sản phi vật thể bao gồm các lễ hội, nghệ thuật trình diễn và truyền khẩu)."
      },
      {
        id: 4,
        question: "The ______ of the ancient temple took several years to complete.",
        options: ["restoration", "building", "making", "buying"],
        correct_answer: "restoration",
        explanation: "Vocabulary: 'Restoration' (sự phục dựng/trùng tu). The action of returning something to its former condition. (Công việc trùng tu giúp đưa các di tích trở lại vẻ đẹp ban đầu)."
      },
      {
        id: 5,
        question: "Hoi An Ancient Town is famous for its unique ______.",
        options: ["architecture", "food", "cars", "trees"],
        correct_answer: "architecture",
        explanation: "Key word: 'Ancient Town' -> Architecture (kiến trúc). The art or practice of designing and constructing buildings. (Phố cổ Hội An nổi tiếng with phong cách kiến trúc độc đáo)."
      },
      {
        id: 6,
        question: "Trang An Landscape Complex is famous for its limestone ______.",
        options: ["landscape", "city", "town", "road"],
        correct_answer: "landscape",
        explanation: "Key word: 'Trang An' -> Landscape (phong cảnh). All the visible features of an area of countryside or land. (Tràng An nổi tiếng với phong cảnh núi đá vôi hùng vĩ)."
      },
      {
        id: 7,
        question: "The Imperial ______ of Thang Long is an important historical site in Hanoi.",
        options: ["Citadel", "Tower", "Bridge", "Gate"],
        correct_answer: "Citadel",
        explanation: "Key word: 'Thang Long' -> Citadel (Hoàng thành). A fortress, typically on high ground, protecting or dominating a city. (Hoàng thành Thăng Long là một di tích lịch sử quan trọng tại Hà Nội)."
      },
      {
        id: 8,
        question: "My Son Sanctuary is a famous ______ site in Quang Nam.",
        options: ["archaeological", "industrial", "educational", "farming"],
        correct_answer: "archaeological",
        explanation: "Vocabulary: 'Archaeological site' (di chỉ khảo cổ). A place where evidence of past activity is preserved. (Thánh địa Mỹ Sơn là một khu di tích khảo cổ nổi tiếng)."
      },
      {
        id: 9,
        question: "Quan Ho Bac Ninh is a traditional style of ______ singing.",
        options: ["folk", "pop", "rock", "rap"],
        correct_answer: "folk",
        explanation: "Vocabulary: 'Folk singing' (hát dân ca). Music that originates in traditional popular culture. (Quan họ Bắc Ninh là một loại hình dân ca truyền thống của Việt Nam)."
      },
      {
        id: 10,
        question: "UNESCO ______ sites that are of outstanding universal value.",
        options: ["recognizes", "knows", "sees", "looks"],
        correct_answer: "recognizes",
        explanation: "Verb: 'Recognizes' (công nhận). To identify from having encountered before. (UNESCO công nhận các địa danh có giá trị nổi bật toàn cầu)."
      },
      {
        id: 11,
        question: "Ca Tru was added to the list of ______ cultural heritage in need of safeguarding.",
        options: ["intangible", "visible", "clear", "new"],
        correct_answer: "intangible",
        explanation: "Term: 'Intangible cultural heritage' (di sản văn hóa phi vật thể). (Ca trù được liệt vào danh sách di sản văn hóa phi vật thể cần được bảo vệ khẩn cấp)."
      },
      {
        id: 12,
        question: "The national park is home to diverse flora and ______.",
        options: ["fauna", "animals", "fish", "birds"],
        correct_answer: "fauna",
        explanation: "Phrase: 'Flora and fauna' (hệ thực vật và động vật). The plants and animals of a particular region. (Vườn quốc gia là nơi sinh sống của hệ thực vật và động vật đa dạng)."
      },
      {
        id: 13,
        question: "Phong Nha - Ke Bang is known for its ______ values and cave systems.",
        options: ["geological", "price", "cost", "money"],
        correct_answer: "geological",
        explanation: "Vocabulary: 'Geological values' (giá trị địa chất). Related to the study of the earth's physical structure. (Phong Nha - Kẻ Bàng nổi tiếng với các giá trị địa chất và hệ thống hang động)."
      },
      {
        id: 14,
        question: "We must protect the heritage site from ______ damage caused by tourism.",
        options: ["environmental", "good", "nice", "safe"],
        correct_answer: "environmental",
        explanation: "Vocabulary: 'Environmental damage' (thiệt hại môi trường). Harm caused to the natural world. (Chúng ta cần bảo vệ di sản khỏi các tác động tiêu cực đến môi trường)."
      },
      {
        id: 15,
        question: "Son Doong is considered the largest ______ in the world.",
        options: ["cave", "hole", "lake", "river"],
        correct_answer: "cave",
        explanation: "Fact: Son Doong -> Largest cave (hang động lớn nhất). (Sơn Đoòng được coi là hang động tự nhiên lớn nhất thế giới)."
      }
    ]
  },
  {
    id: 'u5',
    title: 'Forbidden Library (Unit 5)',
    description: '15 Questions on Cities and Education in the Future.',
    questions: [
      {
        id: 1,
        question: "A ______ is a bridge that connects two buildings high above the ground.",
        options: ["moving walkway", "skybridge", "underground motorway", "vertical farm"],
        correct_answer: "skybridge",
        explanation: "Definition: 'Skybridge' (cầu nối trên cao). A bridge connecting buildings at height. (Skybridge là cầu nối giữa hai tòa nhà ở trên cao)."
      },
      {
        id: 2,
        question: "A ______ is a road built below the surface of the ground.",
        options: ["digital road", "skybridge", "underground motorway", "solar window"],
        correct_answer: "underground motorway",
        explanation: "Definition: 'Underground motorway' (đường cao tốc ngầm). A road constructed beneath the ground. (Đường cao tốc ngầm là đường được xây dựng bên dưới mặt đất)."
      },
      {
        id: 3,
        question: "A ______ can detect changes in temperature, movement or light.",
        options: ["sensor", "drone", "hologram", "mirror"],
        correct_answer: "sensor",
        explanation: "Definition: 'Sensor' (cảm biến). A device that detects physical changes. (Cảm biến là thiết bị phát hiện thay đổi về nhiệt độ, chuyển động hoặc ánh sáng)."
      },
      {
        id: 4,
        question: "A ______ is a house built using 3D printing technology.",
        options: ["floating building", "solar window", "3D printed house", "foldable house"],
        correct_answer: "3D printed house",
        explanation: "Definition: '3D printed house' (nhà in 3D). A house constructed using 3D printing. (Nhà in 3D là nhà được xây dựng bằng công nghệ in 3D)."
      },
      {
        id: 5,
        question: "A ______ delivers packages without a human pilot.",
        options: ["flying vehicle", "drone delivery", "vacuum tube train", "digital classroom"],
        correct_answer: "drone delivery",
        explanation: "Definition: 'Drone delivery' (giao hàng bằng drone). Packages delivered by unmanned aerial vehicles. (Giao hàng bằng drone là dùng máy bay không người lái để vận chuyển hàng hóa)."
      },
      {
        id: 6,
        question: "A ______ is a farm that grows crops in tall buildings.",
        options: ["floating building", "vertical farm", "smart mirror", "moving walkway"],
        correct_answer: "vertical farm",
        explanation: "Definition: 'Vertical farm' (nông trại thẳng đứng). A farm inside a tall building. (Nông trại thẳng đứng là mô hình trồng trọt trong các tòa nhà cao tầng)."
      },
      {
        id: 7,
        question: "A ______ is a very fast train that travels in a special tube.",
        options: ["underground motorway", "drone delivery", "vacuum tube train", "flying vehicle"],
        correct_answer: "vacuum tube train",
        explanation: "Definition: 'Vacuum tube train' (tàu ống chân không). A high-speed train in a tube. (Tàu ống chân không là loại tàu siêu tốc di chuyển trong ống đặc biệt)."
      },
      {
        id: 8,
        question: "A ______ is a classroom that uses advanced technology and digital devices.",
        options: ["digital classroom", "home schooling", "social classroom", "foldable classroom"],
        correct_answer: "digital classroom",
        explanation: "Definition: 'Digital classroom' (lớp học số). A classroom with advanced tech. (Lớp học số là lớp học sử dụng công nghệ tiên tiến và thiết bị kỹ thuật số)."
      },
      {
        id: 9,
        question: "A ______ projects three-dimensional images.",
        options: ["sensor", "hologram device", "smart mirror", "solar window"],
        correct_answer: "hologram device",
        explanation: "Definition: 'Hologram device' (thiết bị chiếu hologram). A device that projects 3D images. (Thiết bị hologram chiếu hình ảnh ba chiều)."
      },
      {
        id: 10,
        question: "______ means education that takes place at home instead of at school.",
        options: ["Digital classroom", "Virtual learning", "Home schooling", "Social education"],
        correct_answer: "Home schooling",
        explanation: "Definition: 'Home schooling' (học tại nhà). Education at home rather than school. (Học tại nhà là hình thức giáo dục diễn ra tại nhà thay vì ở trường)."
      },
      {
        id: 11,
        question: "If a car ______, it stops working.",
        options: ["breaks up", "breaks down", "takes off", "turns on"],
        correct_answer: "breaks down",
        explanation: "Phrasal verb: 'Break down' (hỏng/hư). To stop functioning. (Break down nghĩa là ngừng hoạt động, bị hỏng)."
      },
      {
        id: 12,
        question: "To ______ means to measure the size, amount or degree of something.",
        options: ["exchange", "socialise", "measure", "fold"],
        correct_answer: "measure",
        explanation: "Vocabulary: 'Measure' (đo lường). To find the size or amount. (Measure nghĩa là đo kích thước, số lượng hoặc mức độ của một thứ gì đó)."
      },
      {
        id: 13,
        question: "Something ______ can be folded easily.",
        options: ["floating", "foldable", "valuable", "vertical"],
        correct_answer: "foldable",
        explanation: "Vocabulary: 'Foldable' (có thể gập lại). Able to be folded. (Foldable nghĩa là có thể gập lại được một cách dễ dàng)."
      },
      {
        id: 14,
        question: "A ______ allows people to walk without moving their legs much because it moves automatically.",
        options: ["moving walkway", "skybridge", "digital road", "solar window"],
        correct_answer: "moving walkway",
        explanation: "Definition: 'Moving walkway' (lối đi tự động). A slow-moving conveyor for pedestrians. (Lối đi tự động là băng chuyền giúp người đi bộ di chuyển mà không cần bước nhiều)."
      },
      {
        id: 15,
        question: "If something is ______, it is extremely useful or valuable.",
        options: ["social", "valuable", "invaluable", "measurable"],
        correct_answer: "invaluable",
        explanation: "Vocabulary: 'Invaluable' (vô giá). Extremely useful or important. Note: 'invaluable' ≠ 'not valuable'. (Invaluable nghĩa là cực kỳ quý giá, hữu ích — không phải 'không có giá trị')."
      }
    ]
  },
  {
    id: 'u6',
    title: 'Forbidden Library (Unit 6)',
    description: '15 Questions for Unit 6 ONLY.',
    questions: [
      {
        id: 1,
        question: "Many people suffer from ______ because they do not have enough money to buy food.",
        options: ["racism", "poverty", "healthcare", "funding"],
        correct_answer: "poverty",
        explanation: "Key word: 'not have enough money to buy food' -> Poverty (nghèo đói). The state of being extremely poor. (Nghèo đói là tình trạng không có đủ tiền để trang trải nhu cầu cơ bản)."
      },
      {
        id: 2,
        question: "A person without a home is described as ______.",
        options: ["unemployed", "poor", "homeless", "unequal"],
        correct_answer: "homeless",
        explanation: "Key word: 'without a home' -> Homeless (vô gia cư). Having no home. (Vô gia cư nghĩa là không có nhà ở)."
      },
      {
        id: 3,
        question: "Discrimination based on skin colour or race is called ______.",
        options: ["bullying", "crisis", "racism", "disease"],
        correct_answer: "racism",
        explanation: "Key word: 'based on skin colour or race' -> Racism (phân biệt chủng tộc). Prejudice against people of other races. (Phân biệt chủng tộc là định kiến dựa trên màu da hoặc sắc tộc)."
      },
      {
        id: 4,
        question: "When many people lose their jobs, the country faces high ______.",
        options: ["hunger", "unemployment", "nutrition", "equality"],
        correct_answer: "unemployment",
        explanation: "Key word: 'lose their jobs' -> Unemployment (thất nghiệp). The state of not having a job. (Thất nghiệp là tình trạng không có việc làm)."
      },
      {
        id: 5,
        question: "A serious illness such as malaria is a type of ______.",
        options: ["crime", "pollution", "disease", "crisis"],
        correct_answer: "disease",
        explanation: "Key word: 'serious illness' -> Disease (bệnh tật). A disorder of structure or function in a human. (Bệnh tật là sự rối loạn chức năng cơ thể, như bệnh sốt rét)."
      },
      {
        id: 6,
        question: "When someone repeatedly hurts or threatens another person, it is called ______.",
        options: ["bullying", "cooperation", "shelter", "obesity"],
        correct_answer: "bullying",
        explanation: "Key word: 'repeatedly hurts or threatens' -> Bullying (bắt nạt). Seeking to harm or intimidate someone. (Bắt nạt là hành vi cố ý làm hại hoặc đe dọa người khác)."
      },
      {
        id: 7,
        question: "A sudden economic problem that causes instability is known as a(n) ______.",
        options: ["shelter", "crisis", "war", "profit"],
        correct_answer: "crisis",
        explanation: "Key word: 'sudden economic problem' -> Crisis (khủng hoảng). A time of intense difficulty or danger. (Khủng hoảng là giai đoạn khó khăn hoặc nguy hiểm nghiêm trọng)."
      },
      {
        id: 8,
        question: "Lack of proper food and nutrients can lead to ______.",
        options: ["pollution", "malnutrition", "employment", "obesity"],
        correct_answer: "malnutrition",
        explanation: "Key word: 'Lack of proper food and nutrients' -> Malnutrition (suy dinh dưỡng). Lack of proper nutrition. (Suy dinh dưỡng là tình trạng thiếu các chất dinh dưỡng cần thiết)."
      },
      {
        id: 9,
        question: "Organisations that do not aim to make money are called ______ organisations.",
        options: ["profitable", "non-profit", "economic", "commercial"],
        correct_answer: "non-profit",
        explanation: "Key word: 'do not aim to make money' -> Non-profit (phi lợi nhuận). Not existing or done for the purpose of making a profit. (Tổ chức phi lợi nhuận hoạt động không vì mục đích kiếm tiền)."
      },
      {
        id: 10,
        question: "The government provided emergency ______ after the earthquake.",
        options: ["racism", "funding", "humanitarian aid", "bullying"],
        correct_answer: "humanitarian aid",
        explanation: "Key word: 'emergency... after earthquake' -> Humanitarian aid (viện trợ nhân đạo). Material or logistical assistance for people in need. (Viện trợ nhân đạo là sự giúp đỡ vật chất cho người gặp nạn)."
      },
      {
        id: 11,
        question: "Doctors and hospitals are part of the country’s ______ system.",
        options: ["healthcare", "employment", "crisis", "poverty"],
        correct_answer: "healthcare",
        explanation: "Key word: 'Doctors and hospitals' -> Healthcare (chăm sóc sức khỏe). The organized provision of medical care. (Y tế/Chăm sóc sức khỏe là hệ thống cung cấp dịch vụ khám chữa bệnh)."
      },
      {
        id: 12,
        question: "Too much unhealthy food can cause ______ in children and adults.",
        options: ["hunger", "obesity", "depression", "equality"],
        correct_answer: "obesity",
        explanation: "Key word: 'Too much unhealthy food' -> Obesity (béo phì). The state of being grossly fat or overweight. (Béo phì là tình trạng thừa cân quá mức do ăn uống không lành mạnh)."
      },
      {
        id: 13,
        question: "Dirty air and water are examples of environmental ______.",
        options: ["poverty", "crime", "pollution", "racism"],
        correct_answer: "pollution",
        explanation: "Key word: 'Dirty air and water' -> Pollution (ô nhiễm). The presence in or introduction into the environment of a substance or thing that has harmful or poisonous effects. (Ô nhiễm là sự làm bẩn môi trường không khí, nước...)."
      },
      {
        id: 14,
        question: "A safe place for homeless people to stay is called a ______.",
        options: ["shelter", "funding", "disease", "economy"],
        correct_answer: "shelter",
        explanation: "Key word: 'safe place... to stay' -> Shelter (nơi trú ẩn/nhà tình thương). A place giving temporary protection. (Shelter là nơi cung cấp chỗ ở tạm thời và an toàn)."
      },
      {
        id: 15,
        question: "Scientists often ______ research to study social problems.",
        options: ["shelter", "fund", "conduct", "promote"],
        correct_answer: "conduct",
        explanation: "Collocation: 'Conduct research' (tiến hành nghiên cứu). To organize and carry out research. (Conduct research là cụm từ đi liền với nhau)."
      }
    ]
  },
  { id: 'u7', title: 'Forbidden Library (Unit 7)', description: 'Questions coming soon.', questions: [] },
  { id: 'u8', title: 'Forbidden Library (Unit 8)', description: 'Questions coming soon.', questions: [] }
];

const VocabularyEscapeRoom: React.FC<VocabularyEscapeRoomProps> = ({ unitId = 'u1', onComplete, onReturn }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  const { playCorrect, playWrong } = useGameSound();

  // Find active phase based on prop
  const phase = PHASES.find(p => p.id === unitId) || PHASES[0];
  const totalQuestions = phase.questions.length;

  useEffect(() => {
    if (totalQuestions === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          onComplete(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete, totalQuestions]);

  const handleSelect = (answer: string) => {
    if (isAnswered || totalQuestions === 0) return;
    const question = phase.questions[currentQuestionIdx];

    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === question.correct_answer) {
      playCorrect();
      setScore(s => s + 1);
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (totalQuestions === 0) return;

    if (currentQuestionIdx < phase.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setIsGameOver(true);
      onComplete(Math.round((score / totalQuestions) * 100));
    }
  };

  // If phase has no questions, show cleared state
  if (totalQuestions === 0) {
    return (
      <div className="bg-[#1a0f0a] rounded-[3rem] p-12 md:p-20 text-center shadow-2xl border-4 border-amber-900/20 max-w-2xl mx-auto animate-fadeIn relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 space-y-10">
          <div className="w-24 h-24 bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/20 animate-pulse">
            <Library size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">LIBRARY CLEARED</h2>
            <p className="text-amber-200/40 font-medium italic text-lg leading-relaxed">
              "The ancient inscriptions for {phase.title} have been successfully archived. No further challenges remain in this sector."
            </p>
          </div>
          <button
            onClick={onReturn}
            className="w-full bg-amber-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>Return to Hub</span>
          </button>
        </div>
      </div>
    );
  }

  const question = phase.questions[currentQuestionIdx];

  if (isGameOver) {
    return (
      <div className="bg-slate-900 rounded-2xl p-10 text-center shadow-xl max-w-md mx-auto animate-bounceIn text-white border-4 border-amber-900/30">
        <div className="w-20 h-20 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i className="fa-solid fa-scroll"></i>
        </div>
        <h2 className="text-2xl font-black mb-4 uppercase tracking-wider">LIBRARY SEALED</h2>
        <p className="text-slate-400 mb-8 text-sm italic font-medium">Knowledge successfully archived.</p>
        <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20 mb-8">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Mastery Score</p>
          <p className="text-6xl font-black text-amber-500 italic">{Math.round((score / totalQuestions) * 100)}%</p>
        </div>
        <button onClick={onReturn} className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-amber-500 transition-all">RETURN TO HUB</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-10 animate-fadeIn border-4 border-amber-900/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-700/30 rounded-tl-[2.5rem]"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-700/30 rounded-br-[2.5rem]"></div>

      <div className="flex justify-between items-end border-b-2 border-amber-900/30 pb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">{phase.title}</p>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Forbidden Inscription {currentQuestionIdx + 1}/{totalQuestions}</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SEAL TIME</p>
          <p className={`text-2xl font-mono font-black ${timeLeft < 60 ? 'text-rose-600' : 'text-amber-400'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="space-y-12 py-4 relative z-10">
        <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5 shadow-inner">
          <h4 className="text-xl md:text-2xl font-medium text-[#FFF8E1] text-center italic leading-relaxed">
            "{question.question}"
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {question.options.map((opt, i) => {
            const isCorrect = opt === question.correct_answer;
            const isSelected = selectedAnswer === opt;
            let styles = "bg-white/5 border-2 border-white/10 text-slate-300 hover:bg-white/10 hover:border-amber-500/50 hover:shadow-2xl";
            if (isAnswered) {
              if (isCorrect) styles = "bg-emerald-900/30 border-emerald-500 text-emerald-100 shadow-2xl scale-[1.02]";
              else if (isSelected) styles = "bg-rose-900/30 border-rose-500 text-rose-100 opacity-80 scale-[0.98]";
              else styles = "bg-transparent border-white/5 text-white/10 pointer-events-none";
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`p-6 rounded-[2rem] font-bold text-left transition-all flex items-center shadow-xl group relative overflow-hidden whitespace-normal break-words ${styles}`}
              >
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <span className={`w-10 h-10 rounded-2xl bg-amber-950/50 flex items-center justify-center text-[10px] font-black border-2 transition-colors ${isAnswered && isCorrect ? 'bg-emerald-600 border-emerald-400 text-white' : 'border-amber-700 text-amber-500'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
                <span className="text-base font-medium pl-14">{opt}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="space-y-8 animate-slideUp">
            <div className="p-8 bg-amber-950/40 rounded-[2.5rem] border-2 border-amber-900/20 shadow-inner">
              <h5 className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.4em] mb-4">LIBRARIAN'S NOTES</h5>
              <p className="text-base text-slate-300 font-medium italic">"{question.explanation}"</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-[#FFF8E1] text-[#2d1f18] py-5 rounded-[2rem] font-bold text-sm shadow-2xl hover:bg-white transition-all flex items-center justify-center space-x-3 uppercase tracking-[0.2em] border-b-8 border-slate-300"
            >
              <span>{currentQuestionIdx === totalQuestions - 1 ? 'REVEAL MASTER SCORE' : 'PROCEED TO THE NEXT QUESTION ➝'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyEscapeRoom;
