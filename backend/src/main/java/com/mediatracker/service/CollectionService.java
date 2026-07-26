package com.mediatracker.service;

import com.mediatracker.dto.CollectionDetailDto;
import com.mediatracker.dto.CollectionSummaryDto;
import com.mediatracker.entity.Collection;
import com.mediatracker.entity.MediaItem;
import com.mediatracker.entity.User;
import com.mediatracker.exception.ResourceNotFoundException;
import com.mediatracker.repository.CollectionRepository;
import com.mediatracker.repository.MediaItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final MediaItemRepository mediaItemRepository;
    private final MediaItemService mediaItemService;

    public List<CollectionSummaryDto> listForUser(User user) {
        return collectionRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(c -> CollectionSummaryDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .itemCount(c.getItems().size())
                        .build())
                .collect(Collectors.toList());
    }

    public CollectionDetailDto getOneForUser(Long id, User user) {
        Collection collection = findOwned(id, user);
        return toDetailDto(collection);
    }

    public CollectionDetailDto create(String name, User user) {
        Collection collection = Collection.builder()
                .name(name)
                .owner(user)
                .build();
        return toDetailDto(collectionRepository.save(collection));
    }

    public CollectionDetailDto rename(Long id, String name, User user) {
        Collection collection = findOwned(id, user);
        collection.setName(name);
        return toDetailDto(collectionRepository.save(collection));
    }

    public void delete(Long id, User user) {
        Collection collection = findOwned(id, user);
        collectionRepository.delete(collection);
    }

    public CollectionDetailDto addItem(Long collectionId, Long itemId, User user) {
        Collection collection = findOwned(collectionId, user);
        MediaItem item = mediaItemRepository.findById(itemId)
                .filter(i -> i.getOwner().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Media item " + itemId + " not found"));
        collection.getItems().add(item);
        return toDetailDto(collectionRepository.save(collection));
    }

    public CollectionDetailDto removeItem(Long collectionId, Long itemId, User user) {
        Collection collection = findOwned(collectionId, user);
        collection.getItems().removeIf(item -> item.getId().equals(itemId));
        return toDetailDto(collectionRepository.save(collection));
    }

    private Collection findOwned(Long id, User user) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection " + id + " not found"));
        if (!collection.getOwner().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Collection " + id + " not found");
        }
        return collection;
    }

    private CollectionDetailDto toDetailDto(Collection collection) {
        return CollectionDetailDto.builder()
                .id(collection.getId())
                .name(collection.getName())
                .items(collection.getItems().stream()
                        .map(mediaItemService::toDto)
                        .collect(Collectors.toList()))
                .build();
    }
}
