package com.poetverse.service;

import com.poetverse.dto.CollabRequestDTO;
import com.poetverse.dto.PoemRequestDTO;
import com.poetverse.model.User;
import com.poetverse.repository.CollaborationRepository;
import com.poetverse.repository.CommentRepository;
import com.poetverse.repository.PoemRepository;
import com.poetverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PoemRepository poemRepository;
    private final CollaborationRepository collaborationRepository;
    private final CommentRepository commentRepository;
    private final PoemService poemService;
    private final CollaborationService collaborationService;
    private final CommentService commentService;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded with poets and poems.");
            return;
        }

        log.info("Seeding PoetVerse platform with rich poet personas, masterpieces, and collab threads...");

        // 1. Seed Poets
        User elena = userRepository.save(User.builder()
                .username("elena_solis")
                .email("elena@poetverse.io")
                .password("password123")
                .displayName("Elena Solis")
                .bio("Weaver of midnight sonnets, classical romanticism, and whispers of the Andalusian wind.")
                .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80")
                .location("Granada, Spain")
                .interestGenres(List.of("Sonnets", "Romanticism", "Elegies", "Free Verse"))
                .favoriteThemes(List.of("Melancholy", "Love", "Stars", "Nostalgia"))
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .badges(List.of("Master Sonneteer", "Crown Poet 2026"))
                .build());

        User malik = userRepository.save(User.builder()
                .username("malik_spoken")
                .email("malik@poetverse.io")
                .password("password123")
                .displayName("Malik Vance")
                .bio("Spoken word artist & rhythm architect. Translating urban pavement into fire and cadence.")
                .avatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80")
                .location("Chicago, USA")
                .interestGenres(List.of("Spoken Word", "Slam Poetry", "Free Verse", "Beat Poetry"))
                .favoriteThemes(List.of("Resistance", "Urban", "Identity", "Hope"))
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .badges(List.of("Slam Champion", "Rhythm Architect"))
                .build());

        User kaito = userRepository.save(User.builder()
                .username("kaito_tanka")
                .email("kaito@poetverse.io")
                .password("password123")
                .displayName("Kaito Tanaka")
                .bio("Minimalist observations. Capturing the ephemeral pause between falling raindrops.")
                .avatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80")
                .location("Kyoto, Japan")
                .interestGenres(List.of("Haiku", "Tanka", "Nature", "Zen"))
                .favoriteThemes(List.of("Nature", "Silence", "Seasons", "Mindfulness"))
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .badges(List.of("Zen Master", "Haiku Purist"))
                .build());

        User zoya = userRepository.save(User.builder()
                .username("zoya_mir")
                .email("zoya@poetverse.io")
                .password("password123")
                .displayName("Zoya Mir")
                .bio("Penning contemporary Ghazals and mystic verses on longing, moonlight, and timeless truth.")
                .avatar("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80")
                .location("Lahore, Pakistan")
                .interestGenres(List.of("Ghazal", "Sufi & Mystic", "Romanticism", "Free Verse"))
                .favoriteThemes(List.of("Love", "Philosophy", "Longing", "Moonlight"))
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .badges(List.of("Ghazal Virtuoso", "Verse Weaver"))
                .build());

        User vatsal = userRepository.save(User.builder()
                .username("vatsal_poet")
                .email("vatsal@poetverse.io")
                .password("password123")
                .displayName("Vatsal Awasthi")
                .bio("Exploring the intersection of modern verse, cosmic philosophy, and spontaneous rhythm.")
                .avatar("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80")
                .location("New Delhi, India")
                .interestGenres(List.of("Free Verse", "Sonnets", "Spoken Word", "Philosophy"))
                .favoriteThemes(List.of("Cosmos", "Philosophy", "Love", "Melancholy"))
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .badges(List.of("Pioneer Poet", "Co-Author Pioneer"))
                .build());

        // Connect mutual follows
        elena.getFollowing().add(zoya.getId());
        elena.getFollowing().add(vatsal.getId());
        zoya.getFollowers().add(elena.getId());
        vatsal.getFollowers().add(elena.getId());

        vatsal.getFollowing().add(elena.getId());
        vatsal.getFollowing().add(malik.getId());
        elena.getFollowers().add(vatsal.getId());
        malik.getFollowers().add(vatsal.getId());

        userRepository.saveAll(List.of(elena, malik, kaito, zoya, vatsal));

        // 2. Seed Poems
        var poem1 = poemService.createPoem(elena.getId(), PoemRequestDTO.builder()
                .title("The Architecture of Dusk")
                .genre("Sonnets")
                .mood("Melancholy")
                .tags(List.of("twilight", "sonnet", "longing", "solitude"))
                .isCollabOpen(true)
                .collabMode("ADD_STANZA")
                .content("""
                        The shadows crawl across the whitewashed stone,
                        As twilight folds its amber wings to rest;
                        The clock unwinds its quiet, steady drone,
                        While ancient longings stir within the chest.

                        We build our temples out of borrowed light,
                        And name each silence after what we lost;
                        Yet stars ignite the borders of the night,
                        Unmindful of the burning or the cost.
                        """)
                .build());
        poem1.getLikedBy().add(vatsal.getId());
        poem1.getLikedBy().add(zoya.getId());
        poem1.getLikedBy().add(malik.getId());
        poem1.setLikesCount(3);
        poemRepository.save(poem1);

        var poem2 = poemService.createPoem(kaito.getId(), PoemRequestDTO.builder()
                .title("Three Breaths of Autumn")
                .genre("Haiku")
                .mood("Serene")
                .tags(List.of("autumn", "zen", "nature", "leaves"))
                .isCollabOpen(false)
                .collabMode("NONE")
                .content("""
                        Pale morning mist drifts
                        Upon the copper river—
                        A maple leaf floats.

                        Cold wind through bamboo,
                        The bell tolls across the hill,
                        Silence bows its head.

                        First frost on the pine,
                        Sunlight warms the wooden porch,
                        Winter draws its breath.
                        """)
                .build());
        poem2.getLikedBy().add(elena.getId());
        poem2.getLikedBy().add(vatsal.getId());
        poem2.setLikesCount(2);
        poemRepository.save(poem2);

        var poem3 = poemService.createPoem(malik.getId(), PoemRequestDTO.builder()
                .title("Neon Cadence on 47th Street")
                .genre("Spoken Word")
                .mood("Passionate")
                .tags(List.of("spokenword", "chicago", "rhythm", "citylights"))
                .isCollabOpen(true)
                .collabMode("ADD_STANZA")
                .content("""
                        Listen to the asphalt humming under midnight tires,
                        A city built on stubborn dreams and blue-note fires.
                        Every subway grate exhales the breath of yesterday's hustle,
                        Where tired shoulders carry worlds with quiet muscle.

                        We don't just speak—we strike the anvil of the mic,
                        Turn the friction in our veins into a lightning strike.
                        If you've ever felt the tremor when the bassline drops,
                        You know this heartbeat in our chest ain't never gonna stop.
                        """)
                .build());
        poem3.getLikedBy().add(vatsal.getId());
        poem3.getLikedBy().add(zoya.getId());
        poem3.setLikesCount(2);
        poemRepository.save(poem3);

        var poem4 = poemService.createPoem(zoya.getId(), PoemRequestDTO.builder()
                .title("A Mirror of Stars (آئینہِ شب)")
                .genre("Ghazal")
                .mood("Mystic")
                .tags(List.of("ghazal", "mystic", "love", "night"))
                .isCollabOpen(true)
                .collabMode("ADD_STANZA")
                .content("""
                        The cup is filled with liquid sky, tonight the heavens weep,
                        In quiet alcoves of the soul, the sacred vigil keep.

                        You search the shore for footprints that the gentle wave erased,
                        While oceans in your secret heart run turbulent and deep.

                        What candle ever feared the flame that gave it cause to shine?
                        The moth and fire understand what mortal lovers seek.
                        """)
                .build());
        poem4.getLikedBy().add(elena.getId());
        poem4.getLikedBy().add(kaito.getId());
        poem4.getLikedBy().add(vatsal.getId());
        poem4.setLikesCount(3);
        poemRepository.save(poem4);

        // 3. Seed Comments / Annotations
        commentService.addComment(poem1.getId(), zoya.getId(), 
                "The metaphor 'temples out of borrowed light' resonates deeply. Gorgeous cadence, Elena.", 4);
        commentService.addComment(poem1.getId(), vatsal.getId(), 
                "The volta at the third quatrain flows gracefully. Would love to write a complementary verse with you!", null);

        commentService.addComment(poem3.getId(), vatsal.getId(), 
                "The internal rhyme in 'subway grate / breath of yesterday' hits with pure momentum!", 2);

        // 4. Seed Live Collaboration Threads
        CollabRequestDTO collabReq1 = CollabRequestDTO.builder()
                .title("Echoes Across the Horizon")
                .promptOrTheme("A round-robin poem where each poet contributes a stanza from their continent's perspective at the exact same moment of dawn.")
                .genre("Free Verse")
                .mood("Hopeful")
                .maxStanzas(4)
                .initialStanza("""
                        The first ray strikes the Sierra snow,
                        Melting the crystal frost of slumber,
                        Waking the larks to sing the dawn.
                        """)
                .build();
        var collab1 = collaborationService.createCollaboration(elena.getId(), collabReq1);
        
        // Vatsal adds stanza 2 to this collab
        collaborationService.submitStanza(collab1.getId(), vatsal.getId(), 
                new com.poetverse.dto.StanzaSubmissionDTO("""
                        Across the eastern oceans, bells awake the river ghats,
                        Incense spiraling through the morning fog,
                        Joining the distant hum of waking streets.
                        """));

        log.info("PoetVerse database initialization completed successfully!");
    }
}
