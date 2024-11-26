package com.agilepm.moneyminder.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.agilepm.moneyminder.entity.Category
import com.agilepm.moneyminder.entity.CategoryType
import com.agilepm.moneyminder.entity.Space
import com.agilepm.moneyminder.entity.TransactionType
import com.agilepm.moneyminder.entity.mapToResponse
import com.agilepm.moneyminder.exceptions.ResourceNotFoundException
import com.agilepm.moneyminder.model.request.CategoryRequest
import com.agilepm.moneyminder.model.request.CategoryRequestDefault
import com.agilepm.moneyminder.repository.CategoryRepository
import com.agilepm.moneyminder.model.response.CategoryResponse
import com.agilepm.moneyminder.model.response.TopExpenseResponse
import com.agilepm.moneyminder.repository.SpaceRepository
import java.io.InputStream
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val spaceRepository: SpaceRepository
) {
    private val objectMapper = ObjectMapper()

    @Transactional(readOnly = true)
    fun getAllCategoriesForSpace(spaceId: UUID, type: CategoryType?): List<CategoryResponse> {
        val categories =
            if (type == null) categoryRepository.findAllBySpaceIdOrderByPosition(spaceId)
            else categoryRepository.findAllBySpaceIdAndTypeOrderByPosition(spaceId, type);

        val parentIdToChildCategoryResponses = HashMap<UUID, MutableList<CategoryResponse>>()

        val responses = mutableListOf<CategoryResponse>()

        categories.stream()
            .forEach { category ->
                val response = category.mapToResponse()
                if (category.parentId != null) {
                    val parentToChild = parentIdToChildCategoryResponses[category.parentId]
                    if (parentToChild == null) {
                        parentIdToChildCategoryResponses[category.parentId!!] = mutableListOf(response)
                    } else {
                        parentToChild.add(response)
                    }
                } else {
                    responses.add(response)
                }
            }

        if (parentIdToChildCategoryResponses.isNotEmpty()) {
            responses.forEach { response ->
                val parentToChild = parentIdToChildCategoryResponses[response.id]
                if (parentToChild != null) {
                    response.subCategories = parentToChild
                }
            }
        }

        return responses
    }

    @Transactional
    fun createCategory(spaceId: UUID, categoryRequest: CategoryRequest): CategoryResponse {
        val space = spaceRepository.findById(spaceId).orElseThrow { ResourceNotFoundException("Entity not found") }
        val category = Category(
            id = null,
            name = categoryRequest.name,
            icon = categoryRequest.icon,
            position = categoryRequest.position,
            type = categoryRequest.type,
            space = space,
            parentId = null
        )
        return categoryRepository.save(category).mapToResponse()
    }

    @Transactional
    fun initDefaultCategories(space: Space) {
        val inputStream: InputStream = ClassPathResource("default/default_categories.json").inputStream
        val categoriesFromJson: List<CategoryRequestDefault> =
            objectMapper.readValue(inputStream, Array<CategoryRequestDefault>::class.java).toList()

        categoriesFromJson.forEach { categoryRequest ->
            val category = Category(
                id = null,
                name = categoryRequest.name,
                icon = categoryRequest.icon,
                position = categoryRequest.position,
                type = categoryRequest.type,
                space = space,
                parentId = null
            )

            val savedCategory = categoryRepository.save(category)

            categoryRequest.subCategories.forEach { subcategoryRequest ->
                val subcategory = Category(
                    id = null,
                    name = subcategoryRequest.name,
                    icon = subcategoryRequest.icon,
                    position = subcategoryRequest.position,
                    type = subcategoryRequest.type,
                    space = space,
                    parentId = savedCategory.id
                )
                categoryRepository.save(subcategory)
            }
        }
    }

    @Transactional(readOnly = true)
    fun getTopExpensesByCategories(
        spaceId: UUID,
        dateFrom: LocalDateTime,
        dateTo: LocalDateTime,
        categoryType: CategoryType?,
        categoryIdsToExclude: Set<UUID>,
        accountId: UUID?
    ): List<TopExpenseResponse> {
        val transactionType =
            if (categoryType != null && categoryType == CategoryType.INCOME) TransactionType.INCOME else TransactionType.EXPENSE

        return categoryRepository.findTopExpenses(
            spaceId,
            dateFrom,
            dateTo,
            transactionType,
            categoryIdsToExclude,
            accountId
        ).map {
            TopExpenseResponse(
                total = it.getTotal(),
                category = it.getCategory()?.mapToResponse(),
            )
        }
    }

}
